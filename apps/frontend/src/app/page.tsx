'use client';

import styles from "./page.module.scss";
import React from "react";
import MainPageText from "../components/MainPageText/MainPageText";
import MainPageImages from "../components/MainPageImages/MainPageImages";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";

const MainPage: React.FC = () => {
    return (
        <div className={styles.mainPage}>
            <Header button="visible"/>
            <Navigation />

            <main className={styles.main}>
                <div className={styles.main__content}>
                    <MainPageText />
                    <MainPageImages />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainPage;