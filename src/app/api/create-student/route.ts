import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getFirebaseAdmin } from '@/firebaseAdmin';
import * as admin from 'firebase-admin';

function generateRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-expect-error
    const userId = session.user.id;
    
    // Initialize admin securely, throws if env vars are missing
    const { adminAuth, adminDb } = getFirebaseAdmin();
    
    // Fetch caller's profile to verify school status
    const callerDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!callerDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const callerData = callerDoc.data() as any;

    if (callerData.plan !== 'school') {
      return NextResponse.json({ error: 'Forbidden. Only school accounts can create students.' }, { status: 403 });
    }

    const maxAccounts = callerData.maxStudentAccounts || 0;
    const createdAccounts = callerData.createdStudentAccounts || 0;

    if (createdAccounts >= maxAccounts) {
      return NextResponse.json({ error: 'Maximum student accounts limit reached.' }, { status: 403 });
    }

    // Generate Student Credentials
    const cleanSchoolName = (callerData.schoolName || 'school').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const studentIdNumber = createdAccounts + 1;
    const studentEmail = `student${studentIdNumber}@${cleanSchoolName}.axomai.com`;
    const studentPassword = generateRandomPassword(10);
    const studentName = `Student ${studentIdNumber} (${callerData.schoolName})`;

    // Create Firebase Auth User via Admin SDK
    const userRecord = await adminAuth.createUser({
      email: studentEmail,
      password: studentPassword,
      displayName: studentName,
    });

    // Create Student Document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name: studentName,
      email: studentEmail,
      plan: 'school',
      schoolName: callerData.schoolName,
      isUnlimited: true, // School students get unlimited
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userId,
    });

    // Update School Admin Document
    const newCredential = {
      uid: userRecord.uid,
      email: studentEmail,
      password: studentPassword, // Plain text here ONLY for school admin reference. 
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection('users').doc(userId).update({
      createdStudentAccounts: admin.firestore.FieldValue.increment(1),
      studentAccounts: admin.firestore.FieldValue.arrayUnion(newCredential)
    });

    return NextResponse.json({ 
      success: true, 
      student: newCredential 
    });

  } catch (error: any) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
