import React, { useState, useEffect } from "react";
import styles from './BookingModal.module.scss';
import Button from "../Button/Button";

interface BookingModalProps {
    onBook: (date: Date, time: string) => void;
    tableId: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
    onBook,
    tableId
}) => {
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    async function fetchAvailability(tableId: number, selectedDate: string) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/availability?table_id=${tableId}&date=${encodeURIComponent(selectedDate)}`);
    
            if (!res.ok) {
                throw new Error(`Ошибка HTTP: ${res.status}`);
            }
    
            const data: boolean[] = await res.json();
            const available = timeSlots.filter((slot, index) => !data[index]);
            setAvailableSlots(available);
        } catch (error) {
            console.error("Ошибка получения свободных слотов: ", error);
            setAvailableSlots([]);
        }
    }

    async function createBooking(table_id: number, name: string, date_from: string, date_to: string, phone_number: string) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone_number: phone_number,
                    name: name,
                    date_from: date_from,
                    date_to: date_to,
                    table_id: table_id
                })
            })

            if (res.ok) {
                alert(`Столик забронирован!`);
            }

            if (!res.ok && res.status === 409) {
                alert("Слот недоступен для бронирования");
            }

            if (!res.ok && res.status === 400) {
                alert("Минимальное время для брони - 1 час");
            }

            if (!res.ok) {
                throw new Error(`Ошибка HTTP: ${res.status}`);
            }

            
        } catch (error) {
            console.log("Ошибка бронирования: ", error);
        }
    }

    const handleSubmit = () => {
        if (selectedDate && selectedStartTime && selectedEndTime) {
            const date = selectedDate.split('T')[0];
            const startTime = `${date}T${selectedStartTime}:00+03:00`;
            const endTime = `${date}T${selectedEndTime}:00+03:00`;
            createBooking(tableId, name, startTime, endTime, phone);
            setSelectedDate('');
            setName('');
            setPhone('');
            setSelectedStartTime('');
            setSelectedEndTime('');
        }
        
    }

    function getAvailableEndTimes() {
        if (!selectedStartTime) return [];
    
        const startIndex = timeSlots.indexOf(selectedStartTime);
        const endTimes = [];
    
        for (let i = startIndex + 1; i <= timeSlots.length; i++) {
            if (i === timeSlots.length) {
                endTimes.push('21:00');
            } else {
                endTimes.push(timeSlots[i]);
            }
            
            if (!availableSlots.includes(timeSlots[i])) {
                break;
            }
        }
    
        return endTimes;
    }

    useEffect(() => {
        if (selectedDate) {
          fetchAvailability(tableId, selectedDate);
          setSelectedStartTime('');
          setSelectedEndTime('');
        } else {
          setAvailableSlots([]);
        }
    }, [selectedDate]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Бронирование столика №{tableId}</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className={styles.formField}>
                        <label>Дата:</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                const fullDate = `${e.target.value}T00:00:00+03:00`;
                                setSelectedDate(fullDate);
                                fetchAvailability(tableId, fullDate);
                            }}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label>Время:</label>
                        <select
                            value={selectedStartTime}
                            onChange={e => {
                            setSelectedStartTime(e.target.value);
                            setSelectedEndTime('');
                            }}
                        >
                            <option value="">Выберите время начала</option>
                            {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                        <select
                            value={selectedEndTime}
                            onChange={e => setSelectedEndTime(e.target.value)}
                            disabled={!selectedStartTime}
                        >
                            <option value="">Выберите время конца</option>
                            {getAvailableEndTimes().map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formField}>
                        <label>Имя:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label>Номер телефона:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                            }}
                            required
                        />
                    </div>

                    <Button visible="visible" variant="primary">Забронировать</Button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
