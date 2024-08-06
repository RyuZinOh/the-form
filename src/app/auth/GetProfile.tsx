import { FC } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthContext';

interface ProfileProps {
  userProfile: {
    username: string | null; 
    photoURL?: string | null; 
    email?: string | null;   
  };
}

const GetProfile: FC<ProfileProps> = ({ userProfile }) => {
  const { user } = useAuth(); 

  const username = userProfile.username || user?.displayName || userProfile.email || 'Anonymous';

  const photoURL = userProfile.photoURL || '';

  return (
    <div className="flex items-center">
      {photoURL ? (
        <Image
          src={photoURL}
          alt={username}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-700">{username[0]}</span>
        </div>
      )}
      <span className="ml-2">{username}</span>
    </div>
  );
};

export default GetProfile;
