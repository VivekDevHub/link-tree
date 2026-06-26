function heapify(arr, n, i, compare) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && compare(arr[left], arr[largest]) > 0) {
        largest = left;
    }

    if (right < n && compare(arr[right], arr[largest]) > 0) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest, compare);
    }
}

function heapSort(arr, compare) {
    const result = [...arr];
    const n = result.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(result, n, i, compare);
    }

    for (let i = n - 1; i > 0; i--) {
        [result[0], result[i]] = [result[i], result[0]];
        heapify(result, i, 0, compare);
    }

    return result;
}

export function sortByOrder(links) {
    return heapSort(links, (a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export default heapSort;
