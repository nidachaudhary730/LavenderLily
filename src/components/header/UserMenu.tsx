import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
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
  const { isAdmin } = useAdmin();
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
      <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">My Account</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => navigate('/orders')}
          className="text-sm font-light cursor-pointer gap-2"
        >
          <Package className="h-4 w-4" />
          My Orders
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/favorites')}
          className="text-sm font-light cursor-pointer gap-2"
        >
          <Heart className="h-4 w-4" />
          Wishlist
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="text-sm font-light cursor-pointer gap-2"
        >
          <Settings className="h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate('/admin')}
              className="text-sm font-light cursor-pointer text-primary"
            >
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-sm font-light cursor-pointer gap-2 text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
