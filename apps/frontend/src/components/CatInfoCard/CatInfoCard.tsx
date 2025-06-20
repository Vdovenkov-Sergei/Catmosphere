import React from "react";
import styles from './CatInfoCard.module.scss';

interface CatInfoProps {
    name: string;
    description: string;
    link: string;
    alt: string;
};

const CatInfo: React.FC<CatInfoProps> = ({
    name,
    description,
    link,
    alt
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img className={styles.imageContainer__image} src={link} alt={alt} />
            </div>
            
            <div className={styles.textContainer}>
                <h2 className={styles.textContainer__name}>
                    {name}
                </h2>

                <div className={styles.textContainer__description}>
                    {description}
                </div>
            </div>

        </div>
    );
};

export default CatInfo;