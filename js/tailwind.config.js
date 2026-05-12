tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "on-tertiary-fixed-variant": "#484645",
                "secondary": "#665880",
                "primary-fixed-dim": "#eeb9bd",
                "tertiary-fixed-dim": "#cac6c4",
                "surface-container-highest": "#e4e2e2",
                "on-secondary-fixed-variant": "#4d4067",
                "on-primary-fixed-variant": "#623c40",
                "on-surface-variant": "#504444",
                "tertiary-fixed": "#e6e1e0",
                "error": "#ba1a1a",
                "on-error": "#ffffff",
                "background": "#fbf9f8",
                "on-error-container": "#93000a",
                "primary-container": "#e8b4b8",
                "on-primary-container": "#6b4448",
                "surface-variant": "#e4e2e2",
                "primary-fixed": "#ffdadc",
                "surface-container-high": "#eae8e7",
                "inverse-surface": "#303030",
                "outline-variant": "#d4c2c3",
                "surface": "#fbf9f8",
                "primary": "#7c5357",
                "surface-dim": "#dbd9d9",
                "inverse-primary": "#eeb9bd",
                "secondary-fixed": "#ebddff",
                "tertiary": "#605e5d",
                "on-primary-fixed": "#301216",
                "on-tertiary-fixed": "#1c1b1a",
                "error-container": "#ffdad6",
                "surface-container": "#efeded",
                "tertiary-container": "#c4c0be",
                "surface-tint": "#7c5357",
                "secondary-fixed-dim": "#d0bfed",
                "on-tertiary-container": "#504e4d",
                "on-background": "#1b1c1c",
                "on-secondary-container": "#64567f",
                "on-secondary-fixed": "#211438",
                "inverse-on-surface": "#f2f0f0",
                "surface-bright": "#fbf9f8",
                "on-primary": "#ffffff",
                "on-secondary": "#ffffff",
                "on-tertiary": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "outline": "#827474",
                "on-surface": "#1b1c1c",
                "surface-container-low": "#f5f3f3",
                "secondary-container": "#e1cfff"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "section-gap-mobile": "64px",
                "grid-gutter": "24px",
                "section-gap-desktop": "120px",
                "grid-margin": "24px",
                "base": "8px"
            },
            fontFamily: {
                "headline-sm": ["EB Garamond"],
                "label-caps": ["Manrope"],
                "headline-md": ["EB Garamond"],
                "display-lg": ["EB Garamond"],
                "display-lg-mobile": ["EB Garamond"],
                "body-lg": ["Manrope"],
                "body-md": ["Manrope"],
                "body-sm": ["Manrope"]
            },
            fontSize: {
                "headline-sm": ["24px", { "lineHeight": "1.4", "fontWeight": "500" }],
                "label-caps": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.08em", "fontWeight": "600" }],
                "headline-md": ["32px", { "lineHeight": "1.3", "fontWeight": "500" }],
                "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "500" }],
                "display-lg-mobile": ["36px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "500" }],
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }]
            }
        }
    }
};
