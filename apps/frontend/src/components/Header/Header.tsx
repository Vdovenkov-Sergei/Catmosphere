import React from 'react';
import styles from './Header.module.scss';
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';


interface HeaderProps {
    button: 'visible' | 'invisible';
}

const Header: React.FC<HeaderProps> = ({
    button = 'visible'
}) => {
    const router = useRouter();
    
    const handleButtonClick = () => {
        router.push('/bookingPage');
    }

    return (
        <div className={styles.header}>
            <div className={styles.header__logo}>
                <img src="/Logo.svg" alt="Catmosphere logo" />
            </div>

            <Button visible={button} variant='primary' onClick={handleButtonClick}>
                Забронировать стол
            </Button>
        </div>
    );
};

export default Header;