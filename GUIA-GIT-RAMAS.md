# GUIA-GIT-RAMAS.md

# Objetivo

Mover la versión antigua que actualmente está en `main`
a una nueva rama llamada:

```text
simulacion-conexion
```

y subir la nueva versión moderna al `main`.

---

# Escenario

## GitHub actualmente

```text
main = versión antigua
```

## PC local actualmente

```text
main = versión nueva moderna
```

---

# Resultado final esperado

```text
main
→ nueva versión moderna

simulacion-conexion
→ versión antigua
```

---

# PASOS

## 1. Verificar estado actual

```bash
git status
```

---

## 2. Guardar la nueva versión moderna localmente

```bash
git add .
git commit -m "feat: nueva version moderna"
```

Esto NO sube cambios todavía.
Solo guarda el trabajo localmente.

---

## 3. Traer referencias del GitHub remoto

```bash
git fetch origin
```

Esto NO modifica archivos.
Solo actualiza referencias remotas.

---

## 4. Crear rama con la versión antigua del GitHub

```bash
git checkout -b simulacion-conexion origin/main
```

Esto crea:

```text
simulacion-conexion
```

usando el estado antiguo que estaba en GitHub `main`.

---

## 5. Subir rama antigua a GitHub

```bash
git push origin simulacion-conexion
```

Ahora GitHub tendrá:

```text
main = versión antigua
simulacion-conexion = versión antigua
```

---

## 6. Volver a la rama principal local moderna

```bash
git checkout main
```

Aquí vuelve la nueva versión moderna.

---

## 7. Subir nueva versión moderna al main

```bash
git push origin main
```

---

# Si Git bloquea el push

Usar:

```bash
git push origin main --force-with-lease
```

---

# Resultado final

## GitHub

```text
main
→ nueva versión moderna

simulacion-conexion
→ versión antigua
```

---

# Verificar ramas

## Ver ramas locales

```bash
git branch
```

---

## Ver ramas remotas

```bash
git branch -r
```

---

# Recomendación

NO usar:

```bash
git push --force
```

Preferir:

```bash
git push --force-with-lease
```

porque es más seguro.
