'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Shield, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserRole, toggleUserBlock } from '@/actions/admin';

interface UserActionsProps {
  userId: string;
  isBlocked: boolean;
  role: string;
}

export function UserActions({ userId, isBlocked, role }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleUserBlock(userId, !isBlocked);
      if (result.success) {
        toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      } else {
        toast.error('Action failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    setIsLoading(true);
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error('Action failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleRoleChange}>
          <Shield className="mr-2 h-4 w-4" />
          {role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleBlockToggle}
          className={isBlocked ? 'text-green-600' : 'text-destructive'}
        >
          {isBlocked ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" /> Block User
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
