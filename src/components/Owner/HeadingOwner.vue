<template>
  <div
    ref="layoutRef"
    class="app-wrapper"
    :class="{ 'sidebar-open': isSidebarOpen }"
  >
    <!-- SIDEBAR MÓVIL / TABLET -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
    </transition>

    <aside class="sidebar-container">
      <Sidebar />
    </aside>

    <!-- NAVEGACIÓN ESCRITORIO -->
    <header class="desktop-navbar">
      <div class="desktop-navbar-inner">

        <!-- SUCURSAL -->
        <div class="desktop-brand nav-dropdown-root">
          <button
            type="button"
            class="brand-button"
            :class="{ active: desktopDropdown === 'branch' }"
            @click.stop="toggleDesktopDropdown('branch')"
          >
            <div class="brand-mark">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
            </div>

            <div class="brand-copy">
              <strong>{{ selectedGym }}</strong>
              <span>{{ label('currentBranch', 'Sucursal actual', 'Current branch') }}</span>
            </div>

            <svg class="brand-chevron" :class="{ rotated: desktopDropdown === 'branch' }" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          <transition name="desktop-dropdown">
            <div
              v-if="desktopDropdown === 'branch'"
              class="desktop-dropdown branch-menu"
              @click.stop
            >
              <div class="dropdown-title">
                {{ label('currentBranch', 'Seleccionar sucursal', 'Select branch') }}
              </div>

              <button
                v-for="gym in gyms"
                :key="gym"
                type="button"
                class="branch-option"
                :class="{ selected: selectedGym === gym }"
                @click="selectGym(gym)"
              >
                <span class="branch-option-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                  </svg>
                </span>

                <span class="branch-option-copy">
                  <strong>{{ gym }}</strong>
                  <small>
                    {{
                      selectedGym === gym
                        ? label('', 'Sucursal seleccionada', 'Selected branch')
                        : label('', 'Cambiar a esta sucursal', 'Switch to this branch')
                    }}
                  </small>
                </span>

                <svg v-if="selectedGym === gym" class="option-check" viewBox="0 0 24 24">
                  <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </transition>
        </div>

        <!-- MENÚ CENTRAL -->
        <nav class="desktop-menu">

          <!-- INICIO -->
          <router-link to="/Owner/dashboard" class="desktop-nav-item" @click="closeDesktopDropdown">
            <svg viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>{{ label('home', 'Inicio', 'Home') }}</span>
          </router-link>

          <!-- USUARIOS -->
          <div class="desktop-nav-group nav-dropdown-root">
            <button
              type="button"
              class="desktop-nav-item"
              :class="{ active: desktopDropdown === 'users', current: isGroupActive('users') }"
              @click.stop="toggleDesktopDropdown('users')"
            >
              <svg viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13z" />
              </svg>

              <span>{{ label('users', 'Usuarios', 'Users') }}</span>

              <svg class="nav-chevron" :class="{ rotated: desktopDropdown === 'users' }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            <transition name="desktop-dropdown">
              <div v-if="desktopDropdown === 'users'" class="desktop-dropdown" @click.stop>
                <div class="dropdown-title">
                  {{ label('users', 'Gestión de usuarios', 'User management') }}
                </div>

                <router-link to="/Owner/view-clients" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('viewClients', 'Clientes', 'Clients') }}</strong>
                    <small>{{ label('', 'Consultar y administrar clientes', 'Manage clients') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/view-staff" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon purple">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('viewStaff', 'Personal', 'Staff') }}</strong>
                    <small>{{ label('', 'Consultar y administrar personal', 'Manage staff') }}</small>
                  </span>
                </router-link>

                <div class="dropdown-divider"></div>

                <router-link to="/Owner/register-clients" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon green">
                    <svg viewBox="0 0 24 24">
                      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('registerClients', 'Registrar cliente', 'Register client') }}</strong>
                    <small>{{ label('', 'Agregar un nuevo cliente', 'Add a new client') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/register-staff" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon orange">
                    <svg viewBox="0 0 24 24">
                      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('registerStaff', 'Registrar personal', 'Register staff') }}</strong>
                    <small>{{ label('', 'Agregar nuevo personal', 'Add new staff') }}</small>
                  </span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- PAGOS -->
          <router-link to="/Owner/payments" class="desktop-nav-item" @click="closeDesktopDropdown">
            <svg viewBox="0 0 24 24">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V7H12v9z" />
            </svg>
            <span>{{ label('payments', 'Pagos', 'Payments') }}</span>
          </router-link>

          <!-- ADMINISTRACIÓN -->
          <div class="desktop-nav-group nav-dropdown-root">
            <button
              type="button"
              class="desktop-nav-item"
              :class="{ active: desktopDropdown === 'administration', current: isGroupActive('administration') }"
              @click.stop="toggleDesktopDropdown('administration')"
            >
              <svg viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>

              <span>{{ label('administration', 'Administración', 'Administration') }}</span>

              <svg class="nav-chevron" :class="{ rotated: desktopDropdown === 'administration' }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            <transition name="desktop-dropdown">
              <div v-if="desktopDropdown === 'administration'" class="desktop-dropdown" @click.stop>
                <div class="dropdown-title">
                  {{ label('administration', 'Administración', 'Administration') }}
                </div>

                <router-link to="/Owner/pricing" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('pricingAndPromos', 'Precios y promociones', 'Pricing & promos') }}</strong>
                    <small>{{ label('', 'Tarifas, planes y promociones', 'Rates, plans and promotions') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/fees" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon purple">
                    <svg viewBox="0 0 24 24">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 1.9 1.55 3.28 3.5 3.71V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('feesAndSurcharges', 'Multas y recargos', 'Fees & surcharges') }}</strong>
                    <small>{{ label('', 'Reglas de morosidad y recargos', 'Late fees and surcharge rules') }}</small>
                  </span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- REPORTES / BITÁCORA -->
          <div class="desktop-nav-group nav-dropdown-root">
            <button
              type="button"
              class="desktop-nav-item"
              :class="{ active: desktopDropdown === 'reports', current: isGroupActive('reports') }"
              @click.stop="toggleDesktopDropdown('reports')"
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
              </svg>

              <span>{{ label('logbook', 'Reportes', 'Reports') }}</span>

              <svg class="nav-chevron" :class="{ rotated: desktopDropdown === 'reports' }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            <transition name="desktop-dropdown">
              <div v-if="desktopDropdown === 'reports'" class="desktop-dropdown reports-dropdown" @click.stop>
                <div class="dropdown-title">
                  {{ label('logbook', 'Reportes y bitácora', 'Reports & logbook') }}
                </div>

                <router-link to="/Owner/revenue" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon green">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('revenue', 'Ingresos', 'Revenue') }}</strong>
                    <small>{{ label('', 'Historial de ingresos', 'Revenue history') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/debtors" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon red">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('debtors', 'Deudores', 'Debtors') }}</strong>
                    <small>{{ label('', 'Clientes con adeudos', 'Clients with outstanding balances') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/attendance" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('attendance', 'Asistencias', 'Attendance') }}</strong>
                    <small>{{ label('', 'Registro de asistencias', 'Attendance records') }}</small>
                  </span>
                </router-link>

                <router-link to="/Owner/renewals" class="dropdown-link" @click="closeDesktopDropdown">
                  <span class="dropdown-icon purple">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('renewals', 'Renovaciones', 'Renewals') }}</strong>
                    <small>{{ label('', 'Seguimiento de membresías', 'Membership renewals') }}</small>
                  </span>
                </router-link>
              </div>
            </transition>
          </div>
        </nav>

        <!-- ACCIONES DERECHA -->
        <div class="desktop-actions">

          <!-- SITIO WEB -->
          <button
            type="button"
            class="desktop-action"
            :title="t.irSitioWeb || label('', 'Sitio web', 'Website')"
            @click="activeModal = 'website'"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18"></path>
              <path d="M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21"></path>
              <path d="M12 3c-2.3 2.5-3.5 5.5-3.5 9S9.7 18.5 12 21"></path>
            </svg>
          </button>

          <!-- QR -->
          <button
            type="button"
            class="desktop-action"
            :title="t.qrGimnasio || 'QR'"
            @click="activeModal = 'qr'"
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 4h6v6H4z"></path>
              <path d="M14 4h6v6h-6z"></path>
              <path d="M4 14h6v6H4z"></path>
              <path d="M14 14h2v2h-2z"></path>
              <path d="M18 14h2v6h-6v-2"></path>
            </svg>
          </button>

          <!-- NOTIFICACIONES -->
          <button
            type="button"
            class="desktop-action notification-action"
            :title="t.notificaciones || label('', 'Notificaciones', 'Notifications')"
            @click="isNotificationsOpen = true"
          >
            <span v-if="unreadNotifications > 0" class="notification-count">
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>

            <svg viewBox="0 0 24 24">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
              <path d="M10 21h4"></path>
            </svg>
          </button>

          <div class="desktop-separator"></div>

          <!-- PERFIL -->
          <div class="profile-menu-root nav-dropdown-root">
            <button
              type="button"
              class="desktop-profile"
              :class="{ active: desktopDropdown === 'profile' }"
              @click.stop="toggleDesktopDropdown('profile')"
            >
              <span class="profile-avatar">{{ ownerInitials }}</span>

              <span class="profile-copy">
                <span class="profile-name-row">
                  <img
                    v-if="logoOk"
                    :src="gymLogo"
                    alt=""
                    class="gym-logo"
                    @error="logoOk = false"
                  />
                  <strong>{{ ownerName }}</strong>
                </span>
                <small>Owner</small>
              </span>

              <svg class="profile-chevron" :class="{ rotated: desktopDropdown === 'profile' }" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"></path>
              </svg>
            </button>

            <transition name="desktop-dropdown">
              <div
                v-if="desktopDropdown === 'profile'"
                class="desktop-dropdown profile-dropdown"
                @click.stop
              >
                <div class="profile-dropdown-header">
                  <span class="profile-avatar large">{{ ownerInitials }}</span>

                  <div>
                    <span class="profile-name-row">
                      <img
                        v-if="logoOk"
                        :src="gymLogo"
                        alt=""
                        class="gym-logo"
                        @error="logoOk = false"
                      />
                      <strong>{{ ownerName }}</strong>
                    </span>
                    <span>Owner</span>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <router-link to="/Owner/profile" class="dropdown-link compact" @click="closeDesktopDropdown">
                  <span class="dropdown-icon neutral">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('profile', 'Mi perfil', 'My profile') }}</strong>
                  </span>
                </router-link>

                <router-link to="/Owner/settings" class="dropdown-link compact" @click="closeDesktopDropdown">
                  <span class="dropdown-icon neutral">
                    <svg viewBox="0 0 24 24">
                      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('settings', 'Configuración', 'Settings') }}</strong>
                  </span>
                </router-link>

                <div class="dropdown-divider"></div>

                <button type="button" class="dropdown-link compact logout-link" @click="handleLogout">
                  <span class="dropdown-icon red">
                    <svg viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                  </span>
                  <span class="dropdown-copy">
                    <strong>{{ label('logout', 'Cerrar sesión', 'Log out') }}</strong>
                  </span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTENIDO GENERAL -->
    <div class="main-layout-container">

      <!-- TOP NAV MÓVIL -->
      <nav class="mobile-top-nav">
        <div class="nav-left">
          <button
            type="button"
            class="nav-action-btn"
            @click="toggleSidebar"
            :aria-label="t.abrirMenu || 'Abrir menú'"
          >
            <svg viewBox="0 0 24 24" class="mobile-svg-icon">
              <path d="M4 5h16M4 12h16M4 19h16"></path>
            </svg>
          </button>

          <button
            type="button"
            class="nav-action-btn"
            @click="activeModal = 'website'"
            :title="t.irSitioWeb"
          >
            <svg viewBox="0 0 24 24" class="mobile-svg-icon">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18"></path>
              <path d="M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21"></path>
              <path d="M12 3c-2.3 2.5-3.5 5.5-3.5 9S9.7 18.5 12 21"></path>
            </svg>
          </button>
        </div>

        <div class="mobile-nav-brand">
          <span class="mobile-brand-dot"></span>
          <span>{{ selectedGym }}</span>
        </div>

        <div class="nav-right">
          <button
            type="button"
            class="nav-action-btn"
            @click="activeModal = 'qr'"
            :title="t.qrGimnasio"
          >
            <svg viewBox="0 0 24 24" class="mobile-svg-icon">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"></path>
              <path d="M14 14h2v2h-2zM18 14h2v6h-6v-2"></path>
            </svg>
          </button>

          <button
            type="button"
            class="nav-action-btn notification"
            @click="isNotificationsOpen = true"
            :title="t.notificaciones"
          >
            <span v-if="unreadNotifications > 0" class="mobile-notification-dot"></span>

            <svg viewBox="0 0 24 24" class="mobile-svg-icon">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
              <path d="M10 21h4"></path>
            </svg>
          </button>
        </div>
      </nav>

      <main class="main-content-wrapper">
        <slot />
      </main>
    </div>

    <!-- MODALES -->
    <transition name="pop">
      <div
        v-if="activeModal"
        class="modal-wrapper"
        @click.self="activeModal = null"
      >
        <!-- QR -->
        <div v-if="activeModal === 'qr'" class="custom-panel">
          <div class="panel-header">
            <div>
              <span class="modal-kicker">GYMPRO</span>
              <h3>{{ t.codigoQrAcceso }}</h3>
            </div>

            <button type="button" class="close-panel" @click="activeModal = null">
              &times;
            </button>
          </div>

          <div class="panel-body">
            <div class="qr-container">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS"
                alt="QR Code"
              />
            </div>

            <p>{{ t.muestraCodigoAsistencia }}</p>

            <button type="button" class="action-btn-full">
              {{ t.descargarImprimir }}
            </button>
          </div>
        </div>

        <!-- SITIO WEB -->
        <div v-if="activeModal === 'website'" class="custom-panel">
          <div class="panel-header">
            <div>
              <span class="modal-kicker">GYMPRO</span>
              <h3>{{ t.tuSitioWeb }}</h3>
            </div>

            <button type="button" class="close-panel" @click="activeModal = null">
              &times;
            </button>
          </div>

          <div class="panel-body">
            <div class="qr-preview-container">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS-WEB"
                alt="QR Sitio Web"
                class="preview-qr-img"
              />
            </div>

            <p>{{ t.gestionaApariencia }}</p>

            <button type="button" class="action-btn-full outline">
              {{ t.visitarSitioPublico }}
            </button>

            <button type="button" class="action-btn-full">
              {{ t.descargarQr }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- NOTIFICACIONES -->
    <NotificationsPanel
      :is-open="isNotificationsOpen"
      :notifications="notifications"
      @close="isNotificationsOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';
import NotificationsPanel from './Notifications/NotificationsPanel.vue';
import { traducciones } from './i18n.js';
import { useLang } from './useLang.js';

const router = useRouter();
const route = useRoute();
const { lang } = useLang();

/* =========================================================
   ESTADOS GENERALES
========================================================= */

const layoutRef = ref(null);

const isSidebarOpen = ref(false);
const isNotificationsOpen = ref(false);

const activeModal = ref(null);
const desktopDropdown = ref(null);

const selectedGym = ref(
  localStorage.getItem('owner-selected-gym') || 'Gimnasio Principal'
);

const gyms = ref(['Gimnasio Principal', 'Sucursal Secundaria']);

const notifications = ref([
  {
    id: 1,
    title: 'Sistema',
    message: 'Bienvenido',
    time: 'ahora',
    read: false
  }
]);

/* =========================================================
   PERFIL (datos de prueba)
========================================================= */

const ownerName = 'Jose Luis';

/* Logo temporal generado en línea; reemplázalo por el real */
const gymLogo =
  'https://ui-avatars.com/api/?name=Ultra+Fitness&size=128&background=2563eb&color=ffffff&bold=true';

const logoOk = ref(true);

const ownerInitials = computed(() =>
  ownerName
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
);

/* =========================================================
   IDIOMA
========================================================= */

const idiomaActual = ref(
  localStorage.getItem('owner-idioma') || lang.value || 'es'
);

const t = computed(() => {
  return traducciones[idiomaActual.value] || traducciones.es || {};
});

const label = (key, es, en) => {
  const table = traducciones[idiomaActual.value] || traducciones.es || {};

  if (key && table[key]) {
    return table[key];
  }

  return idiomaActual.value === 'en' ? en : es;
};

const handleIdiomaChanged = (event) => {
  if (event.detail && event.detail.idioma) {
    idiomaActual.value = event.detail.idioma;
  }
};

/* =========================================================
   NOTIFICACIONES
========================================================= */

const unreadNotifications = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

/* =========================================================
   SIDEBAR MÓVIL
========================================================= */

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

/* =========================================================
   GRUPO ACTIVO (resalta el menú cuando estás en una de sus páginas)
========================================================= */

const grupos = {
  users: [
    '/Owner/view-clients',
    '/Owner/view-staff',
    '/Owner/register-clients',
    '/Owner/register-staff'
  ],
  administration: ['/Owner/pricing', '/Owner/fees'],
  reports: [
    '/Owner/revenue',
    '/Owner/debtors',
    '/Owner/attendance',
    '/Owner/renewals'
  ]
};

const isGroupActive = (name) =>
  (grupos[name] || []).some((ruta) => route.path.startsWith(ruta));

/* =========================================================
   DROPDOWNS DESKTOP
========================================================= */

const toggleDesktopDropdown = (name) => {
  desktopDropdown.value = desktopDropdown.value === name ? null : name;
};

const closeDesktopDropdown = () => {
  desktopDropdown.value = null;
};

/* =========================================================
   SUCURSAL
========================================================= */

const selectGym = (gym) => {
  selectedGym.value = gym;
  localStorage.setItem('owner-selected-gym', gym);
  closeDesktopDropdown();
};

/* =========================================================
   CERRAR MENÚ AL HACER CLICK AFUERA
========================================================= */

const handleDocumentClick = (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest('.nav-dropdown-root')) {
    closeDesktopDropdown();
  }
};

/* =========================================================
   ESC
========================================================= */

const handleKeydown = (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  closeDesktopDropdown();
  activeModal.value = null;

  if (isSidebarOpen.value) {
    closeSidebar();
  }
};

/* =========================================================
   RESIZE
========================================================= */

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    closeSidebar();
  } else {
    closeDesktopDropdown();
  }
};

/* =========================================================
   LOGOUT
========================================================= */

const handleLogout = () => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  closeDesktopDropdown();

  router.replace({ name: 'login' });
};

/* =========================================================
   ESTILOS GLOBALES
========================================================= */

const aplicarEstilosGlobales = () => {
  let savedColors = null;

  try {
    savedColors = JSON.parse(localStorage.getItem('app-colors') || 'null');
  } catch {
    savedColors = null;
  }

  const savedRadius = localStorage.getItem('app-radius');
  const savedDensidad = localStorage.getItem('app-densidad');

  const root = document.documentElement;

  if (savedColors) {
    if (savedColors.headingBg) {
      root.style.setProperty('--color-heading-bg', savedColors.headingBg);
    }

    if (savedColors.tablas) {
      root.style.setProperty('--color-tablas', savedColors.tablas);
    }

    if (savedColors.interfaz) {
      root.style.setProperty('--color-interfaz', savedColors.interfaz);
      root.style.setProperty('--bg-custom', savedColors.interfaz);
    }

    if (savedColors.botones) {
      root.style.setProperty('--color-botones', savedColors.botones);
    }

    if (savedColors.tarjetas) {
      root.style.setProperty('--bg-cards', savedColors.tarjetas);
    }

    if (savedColors.titulos) {
      root.style.setProperty('--color-titulos', savedColors.titulos);
    }

    if (savedColors.highlight) {
      root.style.setProperty('--color-highlight', savedColors.highlight);
    }

    if (savedColors.etiquetas) {
      root.style.setProperty('--color-etiquetas', savedColors.etiquetas);
    }

    if (savedColors.textoGeneral) {
      root.style.setProperty('--color-texto-general', savedColors.textoGeneral);
    }

    if (savedColors.textoBotones) {
      root.style.setProperty('--color-texto-botones', savedColors.textoBotones);
    }

    if (savedColors.svgColor) {
      root.style.setProperty('--color-svg', savedColors.svgColor);
    }
  }

  if (savedRadius) {
    root.style.setProperty('--app-border-radius', savedRadius);
  }

  if (savedDensidad === 'compacto') {
    root.style.setProperty('--panel-padding', '16px');
    root.style.setProperty('--row-padding', '10px 0');
  } else if (savedDensidad === 'espacioso') {
    root.style.setProperty('--panel-padding', '38px');
    root.style.setProperty('--row-padding', '22px 0');
  } else {
    root.style.setProperty('--panel-padding', '30px');
    root.style.setProperty('--row-padding', '16px 0');
  }
};

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  aplicarEstilosGlobales();

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
  window.addEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.addEventListener('idioma-changed', handleIdiomaChanged);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.removeEventListener('idioma-changed', handleIdiomaChanged);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap');

/* =========================================================
   BASE
========================================================= */

* {
  box-sizing: border-box;
}

.app-wrapper {
  --nav-height: 68px;
  --accent: var(--color-highlight, #3b82f6);
  --button: var(--color-botones, #2563eb);
  --card: var(--bg-cards, #101317);
  --text: var(--color-texto-general, #f8fafc);
  --title: var(--color-titulos, #ffffff);
  --muted: var(--color-etiquetas, #8b98aa);
  --line: rgba(255, 255, 255, 0.08);

  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background: var(--bg-custom, #090b0e);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  transition: background-color .25s ease;
}

/* =========================================================
   DESKTOP NAVBAR (oculto por defecto)
========================================================= */

.desktop-navbar {
  display: none;
}

/* =========================================================
   SIDEBAR MÓVIL
========================================================= */

.sidebar-container {
  width: 280px;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  background: var(--bg-cards, #101317);
  transform: translateX(-100%);
  transition: transform .3s cubic-bezier(.4, 0, .2, 1);
  box-shadow: 16px 0 40px rgba(0, 0, 0, .45);
}

.sidebar-open .sidebar-container {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 2999;
  background: rgba(0, 0, 0, .66);
  cursor: pointer;
}

/* =========================================================
   LAYOUT
========================================================= */

.main-layout-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* =========================================================
   TOP NAV MÓVIL
========================================================= */

.mobile-top-nav {
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  background: var(--color-heading-bg, #0c1118);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-action-btn {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, .09);
  border-radius: 11px;
  background: rgba(255, 255, 255, .035);
  color: var(--color-svg, #f8fafc);
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}

.nav-action-btn:hover {
  background: rgba(255, 255, 255, .075);
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent);
}

.mobile-svg-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.notification {
  position: relative;
}

.mobile-notification-dot {
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 7px;
  border: 2px solid var(--color-heading-bg, #0c1118);
  border-radius: 50%;
  background: var(--accent);
}

.mobile-nav-brand {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--title);
  font-size: .76rem;
  font-weight: 700;
  overflow: hidden;
}

.mobile-nav-brand span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-brand-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 13%, transparent);
}

/* =========================================================
   MODALES
========================================================= */

.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, .82);
}

.custom-panel {
  width: min(440px, 100%);
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, .09);
  border-radius: 18px;
  background: var(--bg-cards, #111419);
  color: var(--text);
  box-shadow: 0 30px 70px rgba(0, 0, 0, .55);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.modal-kicker {
  display: block;
  margin-bottom: 4px;
  color: var(--accent);
  font-size: .58rem;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.panel-header h3 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-panel {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, .04);
  color: var(--text);
  font-size: 1.45rem;
  cursor: pointer;
  transition: background .17s ease, color .17s ease;
}

.close-panel:hover {
  background: rgba(239, 68, 68, .12);
  color: #f87171;
}

.panel-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
}

.panel-body p {
  margin: 0;
  color: var(--muted);
  font-size: .83rem;
  line-height: 1.6;
}

.qr-container,
.qr-preview-container {
  padding: 13px;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, .3);
}

.qr-container img {
  width: 180px;
  height: 180px;
  display: block;
}

.qr-preview-container {
  width: 170px;
  height: 170px;
}

.preview-qr-img {
  width: 100%;
  height: 100%;
  display: block;
}

.action-btn-full {
  width: 100%;
  min-height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: var(--button);
  color: var(--color-texto-botones, #fff);
  font-family: 'Inter', sans-serif;
  font-size: .78rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform .17s ease, filter .17s ease;
}

.action-btn-full:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.action-btn-full.outline {
  margin-top: 3px;
  border: 1px solid rgba(255, 255, 255, .11);
  background: rgba(255, 255, 255, .035);
  color: var(--text);
}

/* =========================================================
   DESKTOP >= 1024
========================================================= */

@media (min-width: 1024px) {

  .app-wrapper {
    --nav-height: 72px;
    --nav-line: rgba(255, 255, 255, 0.09);
    --hover-bg: rgba(255, 255, 255, 0.07);
  }

  .sidebar-container,
  .sidebar-overlay,
  .mobile-top-nav {
    display: none !important;
  }

  /* ---------- NAVBAR (grid: sucursal | menú centrado | acciones) ---------- */

  .desktop-navbar {
    width: 100%;
    height: var(--nav-height);
    position: sticky;
    top: 0;
    z-index: 2500;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--nav-line);
    background: var(--color-heading-bg, #08192e);
  }

  .desktop-navbar-inner {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    padding: 0 clamp(18px, 2.3vw, 40px);
  }

  /* ---------- SUCURSAL ---------- */

  .desktop-brand {
    min-width: 0;
    max-width: 240px;
    position: relative;
    justify-self: start;
  }

  .brand-button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 10px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: var(--text);
    cursor: pointer;
    transition: background 0.16s ease, border-color 0.16s ease;
  }

  .brand-button:hover,
  .brand-button.active {
    border-color: var(--nav-line);
    background: var(--hover-bg);
  }

  .brand-mark {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--accent);
  }

  .brand-mark svg {
    width: 19px;
    height: 19px;
    fill: currentColor;
  }

  .brand-copy {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-copy strong {
    width: 100%;
    overflow: hidden;
    color: var(--title);
    font-size: 0.92rem;
    font-weight: 700;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .brand-copy span {
    margin-top: 2px;
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .brand-chevron {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: var(--muted);
    transition: transform 0.17s ease;
  }

  .brand-chevron.rotated { transform: rotate(180deg); }

  /* ---------- MENÚ CENTRAL ---------- */

  .desktop-menu {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .desktop-nav-group {
    position: relative;
    flex-shrink: 0;
  }

  .desktop-nav-item {
    min-width: 0;
    flex-shrink: 0;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: color-mix(in srgb, var(--text) 78%, transparent);
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .desktop-nav-item > svg:first-child {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    fill: currentColor;
  }

  .desktop-nav-item:hover,
  .desktop-nav-item.active {
    color: #fff;
    background: var(--hover-bg);
  }

  .desktop-nav-item.router-link-active,
  .desktop-nav-item.current {
    border-color: color-mix(in srgb, var(--accent) 35%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: color-mix(in srgb, var(--accent) 65%, white);
  }

  .nav-chevron {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    fill: currentColor;
    opacity: 0.6;
    transition: transform 0.17s ease;
  }

  .nav-chevron.rotated { transform: rotate(180deg); }

  .desktop-nav-item:focus-visible,
  .desktop-action:focus-visible,
  .desktop-profile:focus-visible,
  .brand-button:focus-visible,
  .dropdown-link:focus-visible,
  .branch-option:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* ---------- DROPDOWNS ---------- */

  .nav-dropdown-root { position: relative; }

  .desktop-dropdown {
    width: 300px;
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: 2700;
    padding: 8px;
    border: 1px solid var(--nav-line);
    border-radius: 14px;
    background: var(--bg-cards, #101419);
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.5);
  }

  .reports-dropdown { width: 310px; }
  .branch-menu { width: 280px; }

  .dropdown-title {
    padding: 8px 10px 11px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--nav-line);
    color: var(--muted);
    font-size: 0.8rem;
    font-weight: 600;
  }

  .dropdown-link,
  .branch-option {
    width: 100%;
    min-height: 54px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.14s ease, color 0.14s ease;
  }

  .dropdown-link:hover,
  .branch-option:hover { background: var(--hover-bg); }

  .dropdown-link.router-link-active {
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: color-mix(in srgb, var(--accent) 70%, white);
  }

  .dropdown-icon,
  .branch-option-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
  }

  .dropdown-icon svg,
  .branch-option-icon svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .dropdown-icon.blue { color: #60a5fa; background: rgba(59, 130, 246, 0.14); }
  .dropdown-icon.purple { color: #c084fc; background: rgba(168, 85, 247, 0.14); }
  .dropdown-icon.green { color: #34d399; background: rgba(16, 185, 129, 0.14); }
  .dropdown-icon.orange { color: #fb923c; background: rgba(249, 115, 22, 0.14); }
  .dropdown-icon.red { color: #f87171; background: rgba(239, 68, 68, 0.14); }
  .dropdown-icon.neutral { color: var(--muted); background: rgba(255, 255, 255, 0.06); }

  .branch-option-icon {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 14%, transparent);
  }

  .dropdown-copy,
  .branch-option-copy {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .dropdown-copy strong,
  .branch-option-copy strong {
    max-width: 100%;
    overflow: hidden;
    color: inherit;
    font-size: 0.9rem;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-copy small,
  .branch-option-copy small {
    max-width: 100%;
    margin-top: 2px;
    overflow: hidden;
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .branch-option.selected {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
  }

  .branch-option.selected .branch-option-copy strong {
    color: color-mix(in srgb, var(--accent) 70%, white);
  }

  .option-check {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--accent);
  }

  .dropdown-divider {
    height: 1px;
    margin: 6px 8px;
    background: var(--nav-line);
  }

  /* ---------- ACCIONES DERECHA ---------- */

  .desktop-actions {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    justify-self: end;
    gap: 4px;
  }

  .desktop-action {
    width: 42px;
    height: 42px;
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: color-mix(in srgb, var(--text) 85%, transparent);
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .desktop-action:hover {
    color: #fff;
    background: var(--hover-bg);
  }

  .desktop-action svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .notification-count {
    min-width: 18px;
    height: 18px;
    position: absolute;
    top: 2px;
    right: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--color-heading-bg, #08192e);
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 0.66rem;
    font-weight: 800;
    line-height: 1;
  }

  .desktop-separator {
    width: 1px;
    height: 28px;
    margin: 0 10px;
    background: var(--nav-line);
  }

  /* ---------- PERFIL ---------- */

  .profile-menu-root { position: relative; }

  .desktop-profile {
    height: 52px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 10px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: var(--text);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .desktop-profile:hover,
  .desktop-profile.active {
    border-color: var(--nav-line);
    background: var(--hover-bg);
  }

  .profile-avatar {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: color-mix(in srgb, var(--accent) 55%, white);
    font-size: 0.8rem;
    font-weight: 800;
  }

  .profile-avatar.large {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    font-size: 0.92rem;
  }

  .profile-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-name-row {
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .gym-logo {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: block;
    border-radius: 6px;
    object-fit: cover;
  }

  .profile-copy strong {
    max-width: 170px;
    overflow: hidden;
    color: var(--title);
    font-size: 0.88rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile-copy small {
    margin-top: 2px;
    color: var(--muted);
    font-size: 0.75rem;
  }

  .profile-chevron {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: var(--muted);
    transition: transform 0.17s ease;
  }

  .profile-chevron.rotated { transform: rotate(180deg); }

  .profile-dropdown {
    width: 330px;
    right: 0;
    left: auto;
  }

  .profile-dropdown-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px 12px;
  }

  .profile-dropdown-header > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .profile-dropdown-header .profile-name-row strong {
    max-width: 245px;
    overflow: hidden;
    color: var(--title);
    font-size: 0.95rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile-dropdown-header .gym-logo {
    width: 22px;
    height: 22px;
  }

  .profile-dropdown-header > div > span:not(.profile-name-row) {
    margin-top: 3px;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .dropdown-link.compact { min-height: 46px; }

  .logout-link { color: #f87171; }
  .logout-link:hover { background: rgba(239, 68, 68, 0.1); }

  /* ---------- MAIN ---------- */

  .main-layout-container {
    width: 100%;
    min-height: calc(100vh - var(--nav-height));
    margin-left: 0 !important;
  }

  /* ---------- TRANSICIONES ---------- */

  .desktop-dropdown-enter-active,
  .desktop-dropdown-leave-active {
    transition: opacity 0.14s ease, transform 0.14s ease;
  }

  .desktop-dropdown-enter-from,
  .desktop-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
}

/* =========================================================
   LAPTOPS (1024 - 1439)
========================================================= */

@media (min-width: 1024px) and (max-width: 1439px) {

  .desktop-navbar-inner {
    gap: 10px;
    padding: 0 20px;
  }

  .brand-copy strong { font-size: 0.86rem; }
  .brand-copy span { font-size: 0.72rem; }

  .desktop-menu { gap: 2px; }

  .desktop-nav-item {
    padding: 0 11px;
    font-size: 0.84rem;
  }

  .profile-copy strong { max-width: 150px; }

  .desktop-separator { margin: 0 6px; }
}

/* =========================================================
   1024 - 1279: se oculta el nombre del perfil
========================================================= */

@media (min-width: 1024px) and (max-width: 1279px) {

  .desktop-navbar-inner {
    gap: 6px;
    padding: 0 14px;
  }

  .desktop-brand { max-width: 170px; }

  .brand-copy span { display: none; }

  .desktop-nav-item {
    padding: 0 8px;
    font-size: 0.8rem;
  }

  .desktop-action {
    width: 38px;
    height: 38px;
  }

  .profile-copy { display: none; }

  .desktop-profile { padding: 0 6px; }
}

/* =========================================================
   1024 - 1160: sucursal compacta y menú sin iconos
========================================================= */

@media (min-width: 1024px) and (max-width: 1160px) {

  .desktop-brand { max-width: 56px; }

  .brand-copy,
  .brand-chevron { display: none; }

  .brand-button { padding: 0 8px; }

  .desktop-nav-item {
    padding: 0 7px;
    font-size: 0.78rem;
  }

  .desktop-nav-item > svg:first-child { display: none; }

  .nav-chevron { display: none; }
}

/* =========================================================
   MÓVIL / TABLET
========================================================= */

@media (max-width: 1023px) {

  .desktop-navbar {
    display: none;
  }

  .sidebar-container {
    display: block;
  }

  .mobile-top-nav {
    display: flex;
  }
}

/* =========================================================
   TELÉFONO
========================================================= */

@media (max-width: 560px) {

  .mobile-top-nav {
    min-height: 60px;
    padding: 9px 10px;
  }

  .nav-left,
  .nav-right {
    gap: 5px;
  }

  .nav-action-btn {
    width: 39px;
    height: 39px;
    border-radius: 10px;
  }

  .mobile-nav-brand {
    max-width: 120px;
    font-size: .67rem;
  }

  .custom-panel {
    padding: 20px;
    border-radius: 15px;
  }

  .qr-container img {
    width: 160px;
    height: 160px;
  }

  .qr-preview-container {
    width: 155px;
    height: 155px;
  }
}

/* =========================================================
   TELÉFONO PEQUEÑO
========================================================= */

@media (max-width: 380px) {

  .mobile-nav-brand {
    display: none;
  }

  .mobile-top-nav {
    justify-content: space-between;
  }
}

/* =========================================================
   TRANSICIONES GENERALES
========================================================= */

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

.pop-enter-from .custom-panel,
.pop-leave-to .custom-panel {
  transform: scale(.97);
}
</style>