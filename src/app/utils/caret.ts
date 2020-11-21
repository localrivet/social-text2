// nodeWalk: walk the element tree, stop when func(node) returns false
export const nodeWalk = (node, func) => {
    var result = func(node); 
    for (node = node.firstChild; result !== false && node; node = node.nextSibling)
        result = nodeWalk(node, func);
    return result;
};

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
export const getCaretPosition = (elem: HTMLElement) => {
    const sel = window.getSelection();
    let cumulativeLength = [0, 0];

    if (sel.anchorNode == elem)
        cumulativeLength = [sel.anchorOffset, sel.focusOffset];
    else {
        const nodesToFind = [sel.anchorNode, sel.focusNode];
        if (!elem.contains(sel.anchorNode) || !elem.contains(sel.focusNode))
            return undefined;
        else {
            const found = [0, 0];
            let i;
            nodeWalk(elem, (node) => {
                for (i = 0; i < 2; i++) {
                    if (node == nodesToFind[i]) {
                        found[i] = 1;
                        if (found[i == 0 ? 1 : 0])
                            return false; // all done
                    }
                }

                if (node.textContent && !node.firstChild) {
                    for (i = 0; i < 2; i++) {
                        if (!found[i])
                            cumulativeLength[i] += node.textContent.length;
                    }
                }
            });
            cumulativeLength[0] += sel.anchorOffset;
            cumulativeLength[1] += sel.focusOffset;
        }
    }
    if (cumulativeLength[0] <= cumulativeLength[1])
        return cumulativeLength;
    return [cumulativeLength[1], cumulativeLength[0]];
}
