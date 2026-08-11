import { useContext } from "react";
import {
  Book,
  Home,
  PlusCircle,
  Library,
  Users,
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  Heart,
  LogOut 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";
import { AuthContext } from "../../contexts/AuthContext";

function AppSidebar() {
  const [role] = useRole();
  const { LogOut:logoutuser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutuser()
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch((err) => console.error(err));
  };

  const adminItems = [
    { title: "Home", to: "/", icon: Home },
    { title: "Manage Users", to: "/dashboard/manage-users", icon: Users },
    { title: "Manage Books", to: "/dashboard/manage-books", icon: Library },
    { title: "My-Profile", to: "/dashboard/my-profile", icon: LayoutDashboard },
  ];
  const librarianItems = [
    { title: "Home", to: "/", icon: Home },
    { title: "Add Book", to: "/dashboard/add-book", icon: PlusCircle },
    { title: "My Books", to: "/dashboard/my-books", icon: Book },
    { title: "Manage Orders", to: "/dashboard/orders", icon: ShoppingBag },
  ];

  const userItems = [
    { title: "Home", to: "/", icon: Home },
    { title: "My-Orders", to: "/dashboard/my-orders", icon: ShoppingBag },
    { title: "My-Invoices", to: "/dashboard/my-invoices", icon: ReceiptText },
    { title: "My-Wishlists", to: "/dashboard/my-wishlist", icon: Heart },
    { title: "My-Profile", to: "/dashboard/my-profile", icon: LayoutDashboard },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {role === "librarian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Librarian Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {librarianItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {role === "user" && (
          <SidebarGroup>
            <SidebarGroupLabel>User Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;