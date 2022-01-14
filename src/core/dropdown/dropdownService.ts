import {writable} from "svelte/store"

export const DropdownService = new class DropdownService {
    activeIndex = writable<number | null>(null)
    maxIndex: number = 0

    init(maxIndex: number) {
        this.maxIndex = maxIndex
    }

    clickHandler(index: number) {
        this.activeIndex.update(v => index)
    }
}()