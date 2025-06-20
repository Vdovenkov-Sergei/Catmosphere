'use client';

import React from "react";
import styles from './CatsPage.module.scss';
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import CatInfoDescription from "../../components/CatInfoDescription/CatInfoDescription";
import CatInfoCard from "../../components/CatInfoCard/CatInfoCard";
import Footer from "@/components/Footer/Footer";

const CatsPage: React.FC = () => {
    return (
        <div className={styles.catsPage}>
            <Header button="visible"/>
            <Navigation />

            <main className={styles.main}>
                <div className={styles.main__content}>
                    <CatInfoDescription />

                    <div className={styles.cats}>
                        <CatInfoCard name="Фиат" description="Всегда смотрит удивленным взглядом. Очень добродушный и обаятельный кот. Любит почесушки щек и спины." link="/CatFiat.png" alt="Фиат" />

                        <CatInfoCard name="Беллиссима" description='Очень любвеобильная и общительная особа. Имеет интересную особенность - забавно урчит с открытым ртом и при этом распушает хвост "елочкой".' link="/CatBelissima.png" alt="Беллиссима" />

                        <CatInfoCard name="Лисма" description="Лисма - молодая и озорная кошка, которую нашли в Подольске. Она настоящая охотница, ее интересуют абсолютно все игрушки: шуршащие бумажки, мышки, мячики и удочки." link="/CatLisma.png" alt="Лисма" />

                        <CatInfoCard name="Натс" description='Двойное имя получил за карьеру в кино. Обладает выразительной мимикой, в совершенстве исполняет "голодный обморок". Всегда будет рад почесушкам и вниманию.' link="/CatNuts.png" alt="Натс" />
                    </div>
                </div>
            </main>

            <Footer />

        </div>
    );
};

export default CatsPage;