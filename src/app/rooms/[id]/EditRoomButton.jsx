'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditModalForm from '@/components/EditModalForm';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function EditRoomButton({ room }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  // Only render if the current user is the owner of the room
  if (!session?.user || session.user.email !== room.userEmail) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E58B19]/40 text-[#E58B19] dark:text-[#FBBF24] bg-[#E58B19]/10 hover:bg-[#E58B19]/20 font-semibold text-sm transition-all"
      >
        <Pencil size={15} />
        Edit Room
      </button>

      {open && (
        <EditModalForm
          room={room}
          onClose={() => setOpen(false)}
          onUpdated={() => router.refresh()}
        />
      )}
    </>
  );
}
