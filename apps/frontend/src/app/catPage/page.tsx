'use client';

import React, { useEffect, useRef, useState } from "react";
import styles from './CatsPage.module.scss';
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import CatInfoDescription from "../../components/CatInfoDescription/CatInfoDescription";
import CatInfoCard from "../../components/CatInfoCard/CatInfoCard";
import Footer from "@/components/Footer/Footer";

interface Cat {
    name: string;
    photo_url: string;
    description: string;
    link: string;
    alt: string;
}

const CatsPage: React.FC = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 4;
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cats?limit=${limit}&offset=${offset}`);
                const data = await response.json();

                if (data.length < limit) {
                    setHasMore(false);
                }

                setCats(prev => [...prev, ...data]);
            } catch (error) {
                console.error("Ошибка загрузки котов:", error);
            }
        };
        fetchCats();
    }, [offset]);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setOffset(prev => prev + limit);
                }
            },
            { rootMargin: '100px' }
        );

        const loader = loaderRef.current;
        if (loader) observer.observe(loader);

        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [hasMore]);

    return (
        <div className={styles.catsPage}>
            <Header button="visible" />
            <Navigation />

            <main className={styles.main}>
                <div className={styles.main__content}>
                    <CatInfoDescription />

                    <div className={styles.cats}>
                        {cats.map((cat, index) => (
                            <CatInfoCard
                                key={index}
                                name={cat.name}
                                description={cat.description}
                                link={cat.photo_url}
                                alt={cat.alt}
                            />
                        ))}
                    </div>

                    {hasMore && <div ref={loaderRef} style={{ height: '1px' }} />}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CatsPage;
