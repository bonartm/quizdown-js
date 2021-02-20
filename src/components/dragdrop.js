import { spring } from 'svelte/motion';
import { crossfade } from 'svelte/transition';
import { quintOut, elasticOut } from 'svelte/easing';

// taken from https://svelte.dev/repl/7c9964de18604b2582ddd844cebdf218?version=3.15.0

const [send, receive] = crossfade({
    duration: (d) => 600,
    easing: elasticOut,
    fallback(node, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: 600,
            easing: quintOut,
            css: (t) => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
        };
    },
});

let dropTarget;
function draggable(node, params) {
    let lastX;
    let lastY;
    let startRect;
    let offsetX = 0;
    let offsetY = 0;
    const offset = spring(
        { x: offsetX, y: offsetY },
        {
            stiffness: 0.2,
            damping: 0.4,
        }
    );

    offset.subscribe((offset) => {
        node.style.left = offset.x + 'px';
        node.style.top = offset.y + 'px';
    });

    node.addEventListener('mousedown', handleMousedown);

    function handleMousedown(event) {
        event.preventDefault();
        lastX = event.clientX;
        lastY = event.clientY;
        if (!startRect) startRect = node.getBoundingClientRect();
        node.classList.add('dragged');

        node.dispatchEvent(
            new CustomEvent('dragstart', {
                detail: { lastX, lastY },
            })
        );

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        offsetX += dx;
        offsetY += dy;
        lastX = event.clientX;
        lastY = event.clientY;
        const rect = node.getBoundingClientRect();
        const midX = rect.x + rect.width / 2;
        const midY = rect.y + rect.height / 2;

        if (dropTarget) dropTarget.classList.remove('droptarget');

        dropTarget = null;
        const candidate = document.elementFromPoint(midX, midY);
        params.targets.map((t) => {
            if (candidate !== null && candidate.matches(t))
                dropTarget = candidate;
        });
        if (dropTarget) dropTarget.classList.add('droptarget');
        offset.set({ x: offsetX + dx, y: offsetY });

        node.dispatchEvent(
            new CustomEvent('drag', {
                detail: { lastX, lastY, dx, dy },
            })
        );
    }

    function handleMouseup(event) {
        if (dropTarget) {
            dropTarget.classList.remove('droptarget');
            const targetRect = dropTarget.getBoundingClientRect();
            offsetX = targetRect.x - startRect.x;
            offsetY = targetRect.y - startRect.y;
        } else {
            offsetX = 0;
            offsetY = 0;
        }
        node.classList.remove('dragged');
        lastX = event.clientX;
        lastY = event.clientY;

        offset.set({ x: offsetX, y: offsetY });

        node.dispatchEvent(
            new CustomEvent('dragend', {
                detail: { dropTarget, lastX, lastY },
            })
        );
        if (dropTarget) {
            dropTarget.dispatchEvent(
                new CustomEvent('dropped', {
                    detail: params.data,
                })
            );
        }
        dropTarget = null;

        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
        },
    };
}

export { draggable };
