export const Colors = {
  // Colores principales - Degradés azules modernos
  primary: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',        // Azul eléctrico
  secondary: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',     // Cyan azulado
  accent: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',        // Azul púrpura
  
  // Colores sólidos para casos donde no se pueden usar degradés
  primarySolid: '#2563eb',
  secondarySolid: '#06b6d4',
  accentSolid: '#6366f1',
  error: '#ef4444',              // Rojo brillante
  success: '#22c55e',            // Verde brillante
  
  // Colores de texto
  textPrimary: '#0f172a',    // Azul casi negro
  textSecondary: 'rgba(15, 23, 42, 0.8)',
  textDisabled: 'rgba(15, 23, 42, 0.6)',
  textLight: '#f8fafc',      // Azul blanco muy suave
  
  // Fondos
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',   // Degradé azul claro
  backgroundSolid: '#f8fafc',
  backgroundDark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Degradé azul oscuro
  backgroundDarkSolid: '#0f172a',
  white: '#FFFFFF',
  
  // Estados
  hover: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',         // Azul más intenso
  hoverSolid: '#1d4ed8',
   
};

export const Typography = {
  // Fuentes
  fontPrimary: 'Montserrat',
  fontSecondary: 'Poppins',
  
  // Tamaños
  h1: {
    fontSize: 30,
    lineHeight: 40, // 120%
    fontFamily: 'Montserrat',
    fontWeight: '700' as const,
    marginTop: 20, // Reducido para minimizar el espacio superior
  },
  h2: {
    fontSize: 20,
    lineHeight: 41.6, // 130%
    fontFamily: 'Montserrat',
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 15,
    lineHeight: 33.6, // 140%
    fontFamily: 'Montserrat',
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24, // 150%
    fontFamily: 'Poppins',
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22.4, // 160%
    fontFamily: 'Poppins',
    fontWeight: '300' as const,
  },
  button: {
    fontSize: 18,
    lineHeight: 18, // 100%
    fontFamily: 'Montserrat',
    fontWeight: '600' as const,
  },
  quote: {
    fontSize: 18,
    lineHeight: 28.8, // 160%
    fontFamily: 'Poppins',
    fontWeight: '500' as const,
    fontStyle: 'italic' as const,
  },
  overline: {
    fontSize: 12,
    lineHeight: 14.4, // 120%
    fontFamily: 'Montserrat',
    fontWeight: '500' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 20,
  xl: 30,
  xxl: 38,
  min: -10,
  xxs: 2,
};