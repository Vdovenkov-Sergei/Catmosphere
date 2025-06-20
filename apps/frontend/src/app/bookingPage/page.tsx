'use client';

import React from "react";
import { useState } from "react";
import styles from './BookingPage.module.scss';
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import BookingModal from "@/components/BookingModal/BookingModal";
import { table } from "console";

const BookingPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [curTableId, setCurTableId] = useState('');

    const toggleForm = (tableId: string) => {
        if (curTableId === tableId) {
            setIsOpen(!isOpen);
        } else if (isOpen === false || curTableId === '') {
            setIsOpen(!isOpen);
        }
        setCurTableId(tableId);
        
    }

    return (
        <div className={styles.bookingPage}>
            <Header button='invisible' />
            <Navigation />

            <main className={styles.main}>
                <div className={styles.main__content}>
                    <div className={styles.tables}>
                        <div className={styles.firstRow}>
                            <img src="/id_1.svg" alt="table1" className={styles.id1} onClick={() => toggleForm('1')} />
                            <img src="/id_2.svg" alt="table2" className={styles.id2} onClick={() => toggleForm('2')} />
                            <img src="/id_3.svg" alt="table3" className={styles.id3} onClick={() => toggleForm('3')} />
                        </div>
                        <div className={styles.secondRow}>
                            <img src="/id_4.svg" alt="table4" className={styles.id4} onClick={() => toggleForm('4')} />
                            <img src="/id_5.svg" alt="table5" className={styles.id5} onClick={() => toggleForm('5')} />
                        </div>
                        <div className={styles.thirdRow}>
                            <img src="/id_6.svg" alt="table6" className={styles.id6} onClick={() => toggleForm('6')} />
                            <img src="/Enter.svg" alt="Enter" className={styles.enter} />
                            <img src="/id_7.svg" alt="table7" className={styles.id7} onClick={() => toggleForm('7')} />
                        </div>
                    </div>
                    
                    {isOpen && (
                        <BookingModal tableId={curTableId} onBook={() => { }} />
                    )}
                </div>
            </main>

            <Footer />

        </div>
    );
};

export default BookingPage;