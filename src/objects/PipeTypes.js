export const PipeConnections = {
    pipeStraight: {
        0: { in: ['bottom', 'top'], out: ['top', 'bottom'] }, 
        90: { in: ['right', 'left'], out: ['left', 'right'] }, 
        180: { in: ['top', 'bottom'], out: ['bottom', 'top'] },
        270: { in: ['left', 'right'], out: ['right', 'left'] }
    },
    pipeCurved: {
        0: { in: ['bottom', 'right'], out: ['right', 'bottom'] },
        90: { in: ['right', 'top'], out: ['top', 'right'] },
        180: { in: ['top', 'left'], out: ['left', 'top'] },
        270: { in: ['left', 'bottom'], out: ['bottom', 'left'] }
    },
    pipeCross: {
        0: { in: ['top', 'right', 'bottom', 'left'], out: ['top', 'right', 'bottom', 'left'] },
        90: { in: ['top', 'right', 'bottom', 'left'], out: ['top', 'right', 'bottom', 'left'] },
        180: { in: ['top', 'right', 'bottom', 'left'], out: ['top', 'right', 'bottom', 'left'] },
        270: { in: ['top', 'right', 'bottom', 'left'], out: ['top', 'right', 'bottom', 'left'] }
    },
    pipeTee: {
        0: { in: ['left', 'right', 'bottom'], out: ['left', 'right', 'bottom'] },
        90: { in: ['top', 'bottom', 'right'], out: ['top', 'bottom', 'right'] },
        180: { in: ['left', 'right', 'top'], out: ['left', 'right', 'top'] },
        270: { in: ['top', 'bottom', 'left'], out: ['top', 'bottom', 'left'] }
    }
  };