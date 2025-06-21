import React from 'react';
import styles from './Navigation.module.scss';
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
    const router = useRouter();

    const handleMainClick = () => {
        router.push('/');
    }

    const handleCatsClick = () => {
        router.push('catPage');
    }

    return (
        <div className={styles.navigation}>
            <div className={styles.navigation__buttons}>
                <Button visible='visible' variant='transparent' onClick={handleMainClick}>
                    Главная
                </Button>

                <Button visible='visible' variant='transparent' onClick={handleCatsClick}>
                    Кошки
                </Button>
            </div>
        </div>
    );
};

export default Navigation;