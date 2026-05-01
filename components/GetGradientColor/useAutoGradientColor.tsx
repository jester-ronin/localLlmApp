// GetGradientColor.ts
import { useState, useEffect } from 'react';
import { getColors } from 'react-native-image-colors';

const fallbackGradient: [string, string] = ['#4c0812', '#f06a32'];

export function useAutoGradientColor(url: string) {
    const [gradientColors, setGradientColors] = useState<[string, string, ...string[]]>(fallbackGradient);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(url, {
                    fallback: fallbackGradient[0],
                    cache: true,
                });

                if (result.platform === 'android') {
                    setGradientColors([result.dominant || fallbackGradient[0], result.vibrant || fallbackGradient[1]]);
                } else if (result.platform === 'ios') {
                    setGradientColors([result.background || fallbackGradient[0], result.primary || fallbackGradient[1]]);
                } else {
                    setGradientColors([result.vibrant || fallbackGradient[0], result.lightVibrant || fallbackGradient[1]]);
                }
            } catch (error) {
                console.warn('Could not extract gradient colors from image', error);
                setGradientColors(fallbackGradient);
            }
        };

        fetchColors();
    }, [url]);

    return { gradientColors };
}
