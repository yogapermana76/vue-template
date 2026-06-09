import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void
}

/**
 * Click Outside Directive
 * Detects clicks outside of the bound element
 *
 * Usage:
 * <div v-click-outside="handler">...</div>
 */
export const vClickOutside: Directive = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      // Check if click is outside the element
      if (!(el === event.target || el.contains(event.target as Node))) {
        // Call the provided method
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }

    // Add event listener with slight delay to avoid immediate trigger
    setTimeout(() => {
      document.addEventListener('click', el.clickOutsideEvent!)
    }, 0)
  },

  unmounted(el: ClickOutsideElement) {
    // Clean up
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
      delete el.clickOutsideEvent
    }
  },
}

export default vClickOutside
