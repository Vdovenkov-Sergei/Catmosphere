import React from "react";
import styles from './MainPageImages.module.scss';

const MainPageImages: React.FC = () => {
    return (
        <div className={styles.container}>
            <img className={styles.container__images} src='/Cats.png' alt='сats' />
        </div>
    );
};

export default MainPageImages;