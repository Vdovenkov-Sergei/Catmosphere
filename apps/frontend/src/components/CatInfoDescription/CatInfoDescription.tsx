import React from "react";
import styles from './CatInfoDescription.module.scss';

const CatInfoDescription = () => {
    return (
        <div className={styles.textContainer}>
            <h1 className={styles.textContainer__header}>
                Живут у нас
            </h1>

            <div className={styles.textContainer__description}>
                В котокафе "catmosphere" на Маросейке в среднем проживает 15-20 пушистых созданий. Индивидуальные и неповторимые, они ищут любящую семью, готовую принять и оберегать их взамен на тепло и уют.
            </div>
        </div>
    );
};

export default CatInfoDescription;