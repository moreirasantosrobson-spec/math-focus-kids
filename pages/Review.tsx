
import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import { getDueForReviewItems } from '../services/srs';
import { generateExercise } from '../services/exerciseGenerator';
import { Attempt, Exercise } from '../types';
import ExercisePlayer from '../components/ExercisePlayer';
import { useI18n } from '../hooks/useI18n';
import { Link } from 'react-router-dom';

const Review: React.FC = () => {
    const { attempts, addAttempt, isInitialized } = useProgressStore();
    const [dueItems, setDueItems] = useState<Attempt[]>([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
    const { t, locale } = useI18n();

    useEffect(() => {
        if (isInitialized) {
            const items = getDueForReviewItems(attempts);
            setDueItems(items);
            setCurrentItemIndex(0);
        }
    }, [attempts, isInitialized]);

    useEffect(() => {
        if (dueItems.length > 0 && currentItemIndex < dueItems.length) {
            const item = dueItems[currentItemIndex];
            const exercise = generateExercise(item.skill, item.difficulty);
            setCurrentExercise(exercise);
        } else {
            setCurrentExercise(null);
        }
    }, [dueItems, currentItemIndex]);

    const handleComplete = (attempt: Attempt) => {
        addAttempt(attempt);
        if (currentItemIndex < dueItems.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        } else {
            // End of review session
            setCurrentExercise(null);
        }
    };
    
    if (!isInitialized) {
        return <div>Loading review items...</div>;
    }

    if (dueItems.length === 0) {
        return (
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold mb-4">No items to review!</h1>
                <p className="text-lg mb-6">Great job! Come back later to review more.</p>
                <Link to={`/${locale}/dashboard`} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">
                    Back to Dashboard
                </Link>
            </div>
        );
    }
    
    if (!currentExercise) {
         return (
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold mb-4">Review complete!</h1>
                <p className="text-lg mb-6">You've finished your review session.</p>
                <Link to={`/${locale}/dashboard`} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Reviewing: {t(`skills.${currentExercise.skill}`)}</h2>
            <ExercisePlayer exercise={currentExercise} onComplete={handleComplete} />
        </div>
    );
};

export default Review;
