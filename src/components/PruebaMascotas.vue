<script setup>
import FitnessPet from './FitnessPet.vue';

const mascotas = [
  { tipo: 'perro', nombre: 'Rocky' },
  { tipo: 'gato', nombre: 'Luna' },
  { tipo: 'pinguino', nombre: 'Pingo' },
  { tipo: 'zorro', nombre: 'Foxy' },
  { tipo: 'rana', nombre: 'Rex' },
  { tipo: 'oso_pardo', nombre: 'Bruno' },
  { tipo: 'oso_polar', nombre: 'Polar' },
  { tipo: 'panda', nombre: 'Panda' },
  { tipo: 'conejo', nombre: 'Bunny' }
];

const versiones = [
  {
    id: 'kawaii',
    nombre: 'Versión Kawaii',
    descripcion: 'Diseño tierno, expresivo y amigable.',
    icono: '♡'
  },
  {
    id: 'rudo',
    nombre: 'Versión Ruda',
    descripcion: 'Diseño fuerte, deportivo y con evolución muscular.',
    icono: '⚡'
  }
];

const rachas = [
  { valor: 0, nombre: 'Huevo' },
  { valor: 5, nombre: 'Bebé' },
  { valor: 15, nombre: 'Joven' },
  { valor: 50, nombre: 'Adulto' },
  { valor: 120, nombre: 'Fitness' },
  { valor: 250, nombre: 'Musculoso' },
  { valor: 400, nombre: 'Legendario' }
];
</script>

<template>
  <main class="test-page">

    <header class="page-header">
      <div>
        <span class="eyebrow">LABORATORIO DE MASCOTAS</span>
        <h1>
          FitnessPet
          <span>Evolution</span>
        </h1>
        <p>
          Comparación de las versiones Kawaii y Ruda
          durante todas las etapas de evolución.
        </p>
      </div>

      <div class="summary">
        <div>
          <strong>{{ mascotas.length }}</strong>
          <span>Mascotas</span>
        </div>

        <div>
          <strong>{{ rachas.length }}</strong>
          <span>Etapas</span>
        </div>

        <div>
          <strong>2</strong>
          <span>Versiones</span>
        </div>
      </div>
    </header>

    <!-- ETAPAS -->
    <section
      v-for="(etapa, etapaIndex) in rachas"
      :key="etapa.valor"
      class="stage-section"
    >

      <header class="stage-header">
        <div>
          <span class="stage-number">
            ETAPA {{ String(etapaIndex + 1).padStart(2, '0') }}
          </span>

          <h2>{{ etapa.nombre }}</h2>
        </div>

        <div class="days">
          <strong>{{ etapa.valor }}</strong>

          <div>
            <span>DÍAS</span>
            <small>DE RACHA</small>
          </div>
        </div>
      </header>

      <!-- VERSIONES -->
      <section
        v-for="version in versiones"
        :key="`${etapa.valor}-${version.id}`"
        class="version-block"
        :class="`version-${version.id}`"
      >

        <header class="version-header">
          <div
            class="version-icon"
            :class="version.id"
          >
            {{ version.icono }}
          </div>

          <div class="version-copy">
            <span>
              {{
                version.id === 'kawaii'
                  ? 'COLECCIÓN KAWAII'
                  : 'COLECCIÓN POWER'
              }}
            </span>

            <h3>{{ version.nombre }}</h3>

            <p>{{ version.descripcion }}</p>
          </div>

          <div
            class="version-badge"
            :class="version.id"
          >
            {{ version.id === 'kawaii' ? 'KAWAII' : 'RUDO' }}
          </div>
        </header>

        <!-- MASCOTAS -->
        <div class="pets-grid">

          <article
            v-for="mascota in mascotas"
            :key="`${etapa.valor}-${version.id}-${mascota.tipo}`"
            class="pet-wrapper"
          >

            <div class="pet-header">
              <div>
                <span>
                  {{ mascota.tipo.replaceAll('_', ' ') }}
                </span>

                <strong>
                  {{ mascota.nombre }}
                </strong>
              </div>

              <div
                class="pet-version-icon"
                :class="version.id"
              >
                {{ version.icono }}
              </div>
            </div>

            <FitnessPet
              :nombre="mascota.nombre"
              :nivel="etapa.nombre"
              :racha="etapa.valor"
              :tipo="mascota.tipo"
              :estilo="version.id"
              :activo-hoy="true"
            />

          </article>

        </div>

      </section>

    </section>

  </main>
</template>

<style scoped>
*{
  box-sizing:border-box;
}

.test-page{
  min-height:100vh;
  padding:32px;
  background:
    radial-gradient(
      circle at 50% 0,
      rgba(59,130,246,.07),
      transparent 28%
    ),
    #080a0e;
  color:#f8fafc;
  font-family:Inter,Arial,sans-serif;
}

/* HEADER */

.page-header{
  width:100%;
  max-width:1500px;
  margin:0 auto 40px;
  padding-bottom:24px;
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:25px;
  border-bottom:1px solid #252a33;
}

.eyebrow{
  display:block;
  margin-bottom:6px;
  color:#3b82f6;
  font-size:10px;
  font-weight:900;
  letter-spacing:.16em;
}

.page-header h1{
  margin:0;
  font-size:36px;
  font-weight:900;
  letter-spacing:-.045em;
}

.page-header h1 span{
  color:#3b82f6;
}

.page-header p{
  max-width:620px;
  margin:9px 0 0;
  color:#94a3b8;
  font-size:12px;
  line-height:1.6;
}

/* RESUMEN */

.summary{
  display:flex;
  gap:8px;
}

.summary>div{
  min-width:90px;
  padding:11px 13px;
  border:1px solid #252a33;
  border-radius:12px;
  background:#101319;
  text-align:center;
}

.summary strong{
  display:block;
  font-size:18px;
}

.summary span{
  display:block;
  margin-top:2px;
  color:#64748b;
  font-size:8px;
  font-weight:800;
  text-transform:uppercase;
}

/* ETAPA */

.stage-section{
  width:100%;
  max-width:1500px;
  margin:0 auto 60px;
}

.stage-header{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:20px;
  margin-bottom:18px;
  padding-bottom:13px;
  border-bottom:1px solid #252a33;
}

.stage-number{
  display:block;
  margin-bottom:3px;
  color:#3b82f6;
  font-size:8px;
  font-weight:900;
  letter-spacing:.15em;
}

.stage-header h2{
  margin:0;
  font-size:24px;
  font-weight:900;
}

.days{
  display:flex;
  align-items:center;
  gap:7px;
}

.days>strong{
  font-size:25px;
  font-weight:900;
}

.days>div{
  display:flex;
  flex-direction:column;
}

.days span{
  color:#94a3b8;
  font-size:8px;
  font-weight:900;
}

.days small{
  color:#475569;
  font-size:7px;
  font-weight:800;
}

/* VERSION */

.version-block{
  margin-bottom:18px;
  padding:18px;
  border:1px solid #252a33;
  border-radius:20px;
  background:#0d1015;
}

.version-kawaii{
  border-color:rgba(244,114,182,.25);
  background:
    radial-gradient(
      circle at 10% 0,
      rgba(244,114,182,.06),
      transparent 25%
    ),
    #0d1015;
}

.version-rudo{
  border-color:rgba(59,130,246,.28);
  background:
    radial-gradient(
      circle at 10% 0,
      rgba(59,130,246,.07),
      transparent 25%
    ),
    #0d1015;
}

.version-header{
  min-height:60px;
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:15px;
}

.version-icon{
  width:44px;
  height:44px;
  flex:0 0 44px;
  display:grid;
  place-items:center;
  border-radius:12px;
  font-size:20px;
  font-weight:900;
}

.version-icon.kawaii{
  border:1px solid rgba(244,114,182,.32);
  background:rgba(244,114,182,.11);
  color:#f472b6;
}

.version-icon.rudo{
  border:1px solid rgba(59,130,246,.35);
  background:rgba(59,130,246,.11);
  color:#60a5fa;
}

.version-copy{
  min-width:0;
}

.version-copy>span{
  display:block;
  margin-bottom:2px;
  color:#64748b;
  font-size:8px;
  font-weight:900;
  letter-spacing:.12em;
}

.version-copy h3{
  margin:0;
  font-size:16px;
  font-weight:900;
}

.version-copy p{
  margin:3px 0 0;
  color:#94a3b8;
  font-size:10px;
}

.version-badge{
  margin-left:auto;
  padding:6px 9px;
  border-radius:8px;
  font-size:8px;
  font-weight:900;
  letter-spacing:.08em;
}

.version-badge.kawaii{
  border:1px solid rgba(244,114,182,.25);
  background:rgba(244,114,182,.08);
  color:#f472b6;
}

.version-badge.rudo{
  border:1px solid rgba(59,130,246,.28);
  background:rgba(59,130,246,.08);
  color:#60a5fa;
}

/* GRID */

.pets-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:14px;
}

/* CARD */

.pet-wrapper{
  min-width:0;
  overflow:hidden;
  border:1px solid #242a33;
  border-radius:18px;
  background:#101319;
  transition:
    transform .2s ease,
    border-color .2s ease;
}

.version-kawaii .pet-wrapper:hover{
  border-color:rgba(244,114,182,.42);
}

.version-rudo .pet-wrapper:hover{
  border-color:rgba(59,130,246,.45);
}

.pet-wrapper:hover{
  transform:translateY(-2px);
}

.pet-header{
  min-height:53px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:10px 13px;
  border-bottom:1px solid #242a33;
  background:#0c0f14;
}

.pet-header>div:first-child{
  min-width:0;
}

.pet-header span{
  display:block;
  margin-bottom:2px;
  color:#64748b;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
  text-transform:uppercase;
}

.pet-header strong{
  display:block;
  overflow:hidden;
  color:#e2e8f0;
  font-size:12px;
  font-weight:800;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.pet-version-icon{
  width:27px;
  height:27px;
  flex:0 0 27px;
  display:grid;
  place-items:center;
  border-radius:8px;
  font-size:13px;
  font-weight:900;
}

.pet-version-icon.kawaii{
  background:rgba(244,114,182,.1);
  color:#f472b6;
}

.pet-version-icon.rudo{
  background:rgba(59,130,246,.1);
  color:#60a5fa;
}

/* TABLET */

@media(max-width:1050px){
  .pets-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
}

/* MÓVIL */

@media(max-width:700px){
  .test-page{
    padding:14px;
  }

  .page-header{
    align-items:flex-start;
    flex-direction:column;
    margin-bottom:28px;
  }

  .page-header h1{
    font-size:29px;
  }

  .summary{
    width:100%;
  }

  .summary>div{
    min-width:0;
    flex:1;
  }

  .stage-section{
    margin-bottom:40px;
  }

  .stage-header h2{
    font-size:20px;
  }

  .version-block{
    padding:12px;
    border-radius:16px;
  }

  .version-copy p{
    display:none;
  }

  .version-badge{
    display:none;
  }

  .pets-grid{
    grid-template-columns:1fr;
  }
}

/* TELÉFONO PEQUEÑO */

@media(max-width:400px){
  .test-page{
    padding:9px;
  }

  .page-header h1{
    font-size:25px;
  }

  .summary>div{
    padding:8px 5px;
  }

  .summary strong{
    font-size:15px;
  }

  .summary span{
    font-size:7px;
  }

  .version-icon{
    width:38px;
    height:38px;
    flex-basis:38px;
    font-size:17px;
  }
}
</style>