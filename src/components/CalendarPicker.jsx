import React, { useState } from 'react';
import './CalendarPicker.css';

const months = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

const CalendarPicker = ({ selectedDate, onDateSelect, highlightedDates = [], disablePastDates = false, disablePastMonths = false, fullWidth = false, onlyAllowHighlighted = false, isAdminMode = false, lockedDates = [], customDates = [], onToggleLock, onAddDate, onRemoveDate, allowedDayOfWeek = null }) => {
  const initialDate = Array.isArray(selectedDate) && selectedDate.length > 0 ? selectedDate[0] : (typeof selectedDate === 'string' && selectedDate ? selectedDate : null);
  const [currentDate, setCurrentDate] = useState(initialDate ? new Date(initialDate) : new Date());

  const currentActualDate = new Date();
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday(0) to 6, Monday(1) to 0
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const isPrevDisabled = disablePastMonths && (
    year < currentActualDate.getFullYear() || 
    (year === currentActualDate.getFullYear() && month <= currentActualDate.getMonth())
  );

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderCells = () => {
    const cells = [];
    
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = Array.isArray(selectedDate) ? selectedDate.includes(dateStr) : selectedDate === dateStr;
      const isHighlighted = highlightedDates.includes(dateStr);
      
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      const dateDayOfWeek = new Date(year, month, d).getDay();
      const isAllowedDay = allowedDayOfWeek === null || allowedDayOfWeek === dateDayOfWeek;
      const isLocked = lockedDates.includes(dateStr);
      const isCustom = customDates.includes(dateStr);

      const isPastDate = disablePastDates && (
        year < currentActualDate.getFullYear() || 
        (year === currentActualDate.getFullYear() && month < currentActualDate.getMonth()) ||
        (year === currentActualDate.getFullYear() && month === currentActualDate.getMonth() && d < currentActualDate.getDate())
      );

      // Pokud není admin, zablokované datumy jsou brány jako minulost (nejdou zakliknout)
      const isDisabledForUser = isPastDate || (onlyAllowHighlighted && !isHighlighted) || isLocked;
      // Admin může klikat i na zablokované (aby je mohl odblokovat přes onToggleLock nebo onAddDate)
      const isDisabled = isAdminMode ? isPastDate : isDisabledForUser;

      cells.push(
        <div 
          key={d} 
          className={`cal-cell ${isSelected ? 'selected' : ''} ${isHighlighted && !isPastDate ? 'highlighted' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'past-disabled' : ''} ${isLocked ? 'locked-date' : ''}`}
          onClick={() => {
            if (!isDisabled) {
              onDateSelect(dateStr);
            }
          }}
        >
          <span className="cal-day-num">{d}</span>
          
          {/* Tečka pro veřejnost */}
          {isHighlighted && !isPastDate && !onlyAllowHighlighted && !isLocked && !isAdminMode && <span className="cal-dot"></span>}
          
          {/* Pokud není admin a je to zablokované, ukážeme jen malý červený zámeček */}
          {isLocked && !isAdminMode && !isPastDate && isHighlighted && (
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#e53e3e', position: 'absolute', top: '2px', right: '2px' }}>
              lock
            </span>
          )}

          {/* ADMIN OVLÁDÁNÍ */}
          {isAdminMode && !isPastDate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'absolute', top: '2px', right: '2px' }}>
              {isHighlighted ? (
                <>
                  <span 
                    className="material-symbols-outlined cal-admin-icon" 
                    title={isLocked ? "Odemknout termín" : "Zamknout termín"}
                    style={{ fontSize: '14px', color: isLocked ? '#e53e3e' : '#10b981', cursor: 'pointer', background: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleLock) onToggleLock(dateStr);
                    }}
                  >
                    {isLocked ? 'lock' : 'lock_open'}
                  </span>
                  
                  {isCustom && onRemoveDate && (
                    <span 
                      className="material-symbols-outlined cal-admin-icon" 
                      title="Odstranit tento termín úplně"
                      style={{ fontSize: '14px', color: '#e53e3e', cursor: 'pointer', background: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDate(dateStr);
                      }}
                    >
                      remove_circle
                    </span>
                  )}
                </>
              ) : (
                isAllowedDay && onAddDate && (
                  <span 
                    className="material-symbols-outlined cal-admin-icon" 
                    title="Přidat tento termín"
                    style={{ fontSize: '16px', color: '#3b82f6', cursor: 'pointer', background: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDate(dateStr);
                    }}
                  >
                    add_circle
                  </span>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className={`custom-calendar ${fullWidth ? 'full-width' : 'default-width'}`}>
      <div className="cal-header">
        <div className="cal-month-year">
          {months[month]} {year}
        </div>
        <div className="cal-nav">
          <button type="button" onClick={prevMonth} disabled={isPrevDisabled} style={{opacity: isPrevDisabled ? 0.3 : 1, cursor: isPrevDisabled ? 'default' : 'pointer'}}>&lt;</button>
          <button type="button" onClick={nextMonth}>&gt;</button>
        </div>
      </div>
      
      <div className="cal-weekdays">
        {days.map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="cal-grid">
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarPicker;
