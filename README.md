# Inline Status Badges

Un plugin para Obsidian que detecta tokens de estado en el contenido markdown renderizado y los reemplaza por badges visuales estilizados.

## Características

- **Detección de status**: Reconoce las siguientes palabras clave:
  - `#todo`
  - `#doing`
  - `#done`
  - `#blocked`
  - `manage_todo_list`

- **Badges interactivos**: Haz clic en cualquier badge para ciclar entre estados (todo → doing → done → blocked → todo)

- **Diseño visual**: Cada estado tiene su propio color:
  - **TODO**: Gris
  - **DOING**: Azul
  - **DONE**: Verde
  - **BLOCKED**: Rojo

- **Sin modificación del origen**: El markdown fuente permanece intacto, solo se modifica el DOM renderizado

- **Configuración personalizable**:
  - Activar/desactivar badges
  - Personalizar etiquetas para cada estado

## Uso

1. Habilita el plugin en Obsidian
2. Escribe los tokens de estado en tus notas markdown
3. Los badges aparecerán automáticamente en el renderizado
4. Haz clic en los badges para cambiar de estado

## Configuración

Accede a Configuración → Plugins → Inline Status Badges para:
- Activar o desactivar los badges
- Personalizar el texto de las etiquetas (ej: "En progreso" en lugar de "DOING")
