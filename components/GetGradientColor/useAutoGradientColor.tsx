// GetGradientColor.ts
import { useState, useEffect } from 'react';
import { getColors } from 'react-native-image-colors';

export function useAutoGradientColor(url: string) {
    const [gradientColors, setGradientColors] = useState<[string, string, ...string[]]>(['#f3f3f3', '#e2e2e2']);

    useEffect(() => {
        const fetchColors = async () => {
            const result = await getColors(url, {
                fallback: '#000000',
                cache: true,
            });

            if (result.platform === 'android') {
                setGradientColors([result.dominant || '#ccc', result.vibrant || '#eee']);
            } else if (result.platform === 'ios') {
                setGradientColors([result.background || '#ccc', result.primary || '#eee']);
            } else {
                setGradientColors([result.vibrant || '#ccc', result.lightVibrant || '#eee']);
            }
        };

        fetchColors();
    }, [url]);

    return {gradientColors};
}
