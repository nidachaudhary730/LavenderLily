import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    navigate('/');
  };

  if (!user) {
    return (
      <Link 
        to="/auth" 
        className="hover:opacity-70 transition-opacity"
        aria-label="Sign in"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:opacity-70 transition-opacity focus:outline-none">
        <User className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-none">
        <DropdownMenuItem className="text-sm font-light text-muted-foreground cursor-default">
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-sm font-light cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
