import { verifySession } from "@/_lib/session";
import { logout } from "@/actions";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";

export default async function Header() {
    const session = await verifySession();

    return (
        <>
            <Navbar className="shadow mb-6">
                <NavbarBrand>
                    <Link href="/" className="font-bold">
                        I Love Numbers
                    </Link>
                </NavbarBrand>

                <NavbarContent justify="end">
                    {session.isAuth ? (
                        <form action={logout}>
                            <Button color="danger" type="submit">
                                Logout
                            </Button>
                        </form>
                    ) : (
                        <>
                            <Link href="/signup">
                                <Button color="secondary">Signup</Button>
                            </Link>
                            <Link href="/login">
                                <Button color="primary">Login</Button>
                            </Link>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    );
}
