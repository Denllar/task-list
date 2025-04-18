import React from 'react';
import { TooltipSort } from '@/components/shared/TooltipSort';

interface AddTaskProps {
    filter: 'all' | 'overdue' | 'urgent' | 'completed' | 'undone',
    handleFilterChange: (newFilter: 'all' | 'overdue' | 'urgent' | 'completed' | 'undone') => void,
    countTasks: (filter: 'overdue' | 'urgent' | 'completed' | 'undone') => number,
}

export const AddTask: React.FC<AddTaskProps> = ({
    filter,
    handleFilterChange,
    countTasks,
}) => {
    return (
        <div className='flex gap-3'>
            <TooltipSort
                text={`ПРОСРОЧЕННЫЕ (${countTasks('overdue')})`}
                description='Просроченные задачи'
                variant='overdue'
                setFilter={() => handleFilterChange('overdue')}
                isActive={filter === 'overdue'}
            />
            {/* <TooltipSort
                text={`С (${countTasks('urgent')})`}
                description='Срочные задачи'
                variant='urgent'
                setFilter={() => handleFilterChange('urgent')}
                isActive={filter === 'urgent'}
            /> */}
            <TooltipSort
                text={`НЕВЫПОЛНЕННЫЕ (${countTasks('undone')})`}
                description='Невыполненные задачи'
                variant='undone'
                setFilter={() => handleFilterChange('undone')}
                isActive={filter === 'undone'}
            />
            <TooltipSort
                text={`ВЫПОЛНЕННЫЕ (${countTasks('completed')})`}
                description='Выполненные задачи'
                variant='completed'
                setFilter={() => handleFilterChange('completed')}
                isActive={filter === 'completed'}
            />
        </div>
    );
};