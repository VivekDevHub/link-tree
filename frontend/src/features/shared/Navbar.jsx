import React from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import darkLogo from '@/assets/darkLogo.png';
import { useAuth } from '../auth/context/AuthContext';
import useLogout from '../auth/hooks/useLogout';

const Navbar = () => {
    const { user } = useAuth();
    const { handleLogout, isLoggingOut } = useLogout();

    return (
        <nav className={styles.nav}>
            <div className={styles.logoCont}>
                <Image alt="Logo of linkter" src={darkLogo} className={styles.logo} />
                <h2 className={styles.logoText}>Linkter</h2>
            </div>

            {user ? (
                <div className={styles.other}>
                    {user.role !== "admin" && (
                        <Link className={styles.upgradeBtn} href="/pricing">
                            Upgrade
                        </Link>
                    )}
                    {user.role === "admin" && (
                        <Link className={styles.adminBtn} href="/admin">
                            Admin
                        </Link>
                    )}
                    <Link className={styles.usernameLink} href={`/${user.username}`}>
                        {user.profilePicture ? (
                            <Image src={user.profilePicture} alt={user.username} width={36} height={36} unoptimized className={styles.pfp} />
                        ) : (
                            <span className={styles.pfpInitial}>{user.username[0].toUpperCase()}</span>
                        )}
                        <span className={styles.username}>{user.username}</span>
                    </Link>
                    <button className={styles.logoutBtn} onClick={handleLogout} disabled={isLoggingOut}>Logout</button>
                </div>
            ) : null}
        </nav>
    );
};

export default Navbar;
