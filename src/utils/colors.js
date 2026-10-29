const PALETTE = [
    '#ef4444', '#f97316', '#f59e0b', '#22c55e',
    '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
];

const shuffle = (list) => {
    const result = [...list];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};

// Devuelve el color indicado o, si no hay, uno aleatorio sin repetir hasta agotar la paleta
export function createColorPicker() {
    let pool = [];

    return (color) => {
        if (color) {
            return color;
        }

        if (!pool.length) {
            pool = shuffle(PALETTE);
        }

        return pool.pop();
    };
}
