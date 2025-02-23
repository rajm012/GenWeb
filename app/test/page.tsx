"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { AlertCircle, Check, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

type AuthStatus = 'authenticated' | 'needs_auth' | 'error';

const DriveAuthManager: React.FC = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for auth callback parameters
    const authResult = searchParams.get('auth');
    if (authResult === 'success') {
      setAuthStatus('authenticated');
    } else if (authResult === 'error') {
      setError(searchParams.get('message') || 'Authentication failed');
      setAuthStatus('error');
    }
  }, [searchParams]);

  const startAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/start-auth');
      if (!response.ok) {
        throw new Error('Failed to start authentication');
      }
      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (err) {
      setError('Failed to start authentication');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Google Drive Document Manager</CardTitle>
          {user && (
            <p className="text-sm text-gray-500">Signed in as </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Authentication Required */}
          {!authStatus && (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  One-time authentication required to access Google Drive
                </AlertDescription>
              </Alert>
              <button
                onClick={startAuth}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Authenticate with Google Drive
              </button>
            </div>
          )}

          {/* Authenticated */}
          {authStatus === 'authenticated' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check />
                <span>Successfully authenticated with Google Drive</span>
              </div>
            </div>
          )}

          {/* Error */}
          {authStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriveAuthManager;
