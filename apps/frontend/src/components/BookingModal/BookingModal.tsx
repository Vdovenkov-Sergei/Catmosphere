import React from "react";
import styles from './BookingModal.module.scss';
import { useState } from "react";
import Button from "../Button/Button";

interface BookingModalProps {
    onBook: (date: Date, time: string) => void;
    tableId: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
    onBook,
    tableId
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');

    const timeSlots = [
        '09:00', '11:00', '13:00', '15:00', '17:00'
    ];
    
    const handleSubmit = () => {
        if (selectedDate && selectedTime) {
            onBook(selectedDate, selectedTime);
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Бронирование столика №{tableId}</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label>Дата:</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label>Время:</label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="">Выберите время</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}></option>
                            ))}
                        </select>
                    </div>

                    <Button visible="visible" variant="primary">Забронировать</Button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;