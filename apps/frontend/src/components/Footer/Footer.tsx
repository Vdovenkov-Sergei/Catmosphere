import React from "react";
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <div className={styles.footer}>
            <p className={styles.bold}>Адрес:</p>
            <p>г. Нижний Новгород, ул. Маросейка д. 10.1с1</p>
        </div>
    );
};

export default Footer;