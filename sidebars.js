module.exports = {
  tutorialSidebar: [
    'intro',
    'installation',
    'quick-start',
    'system-overview',
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/data-loading',
        'features/calibration-analysis',
        'features/range-system',
        'features/distance-optimization',
        'features/visualization',
        'features/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Workflow',
      items: ['workflow/full-workflow'],
    },
    'troubleshooting',
  ],
};
