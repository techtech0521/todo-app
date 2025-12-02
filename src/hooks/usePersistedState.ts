// ========================================
// CUSTOM HOOK - 永続化されたState
// ========================================

import React, { useState, useEffect } from 'react';

/**
 * 永続化されたStateフック
 * localStorageを使ってデータを保存・復元
 */
export function usePersistedState<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    // localStorageから初期値を読み込む
    const [state, setState] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Failed to load data for key "${key}":`, error);
            return initialValue;
        }
    });

    // stateが変更されたらlocalStorageに保存
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Failed to save data for key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}