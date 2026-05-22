import React, { useState, useRef, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  FileText,
  AppWindow,
  Bug,
  Wallet,
  ChevronRight,
  ChevronDown,
  Download,
  FileCode,
  Gift,
  Globe,
  DollarSign,
  ArrowRightLeft,
  Settings,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Sliders,
  Users,
  Receipt,
  LayoutList,
  Calendar,
  MessageSquare,
  Bell,
  Table,
  PieChart,
  X,
  FolderTree,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  AlertTriangle,
} from "lucide-react";

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

/* ═══════════════════════════════════════
   MENU CONFIGURATION (Dynamic Data)
   ═══════════════════════════════════════ */
const MENU_CONFIG = [
  {
    group: "Dashboard",
    items: [
      { name: "Analytics", path: "/", icon: BarChart2, end: true },
      { name: "Team / Users", path: "/users", icon: Users },
      { name: "My Apps", path: "/applications", icon: AppWindow },
    ],
  },
  {
    group: "Inventory",
    items: [
      { name: "Products", path: "/inventory/products", icon: LayoutList },
      { name: "Categories", path: "/inventory/categories", icon: FolderTree },
      { name: "Stock In", path: "/inventory/stock-in", icon: PackagePlus },
      { name: "Stock Out", path: "/inventory/stock-out",icon: PackageMinus },
      { name: "Stock Adjustments", path: "/inventory/stock-adjustments", icon: SlidersHorizontal },
      { name: "Low Stock", path: "/inventory/low-stock", icon: AlertTriangle },
      { name: "Brands", path: "/inventory/brands", icon: PackagePlus },
      { name: "Warehouses", path: "/inventory/warehouses", icon: PackageMinus },
      { name: "Transfers", path: "/inventory/transfers", icon: ArrowRightLeft },
      { name: "Orders", path: "/inventory/orders", icon: Receipt },
      { name: "Refunds", path: "/inventory/refunds", icon: ArrowRightLeft },
      { name: "Returns", path: "/inventory/returns", icon: ArrowRightLeft },
    ],
  },
  {
    group: "Productivity",
    items: [
      { name: "Kanban Board", path: "/kanban", icon: LayoutList },  
      { name: "Calendar", path: "/calendar", icon: Calendar },
      { name: "Chat", path: "/chat", icon: MessageSquare },
    ],
  },
  {
    group: "Reporting",
    items: [
      {
        name: "Reports & Data",
        path: "/insights",
        icon: FileText,
        children: [
          { name: "Data Tables", path: "/tables", icon: Table },
          { name: "Charts Gallery", path: "/charts", icon: PieChart },
          { name: "Custom Reports", path: "/reports", icon: FileText },
        ],
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        name: "My Finances",
        path: "/payments",
        icon: Wallet,
        children: [
          { name: "Earnings", path: "/payments/earnings", icon: DollarSign },
          {
            name: "Transactions",
            path: "/payments/transactions",
            icon: ArrowRightLeft,
          },
          { name: "Invoices", path: "/payments/invoices", icon: Receipt },
          { name: "Settings", path: "/payments/settings", icon: Settings },
        ],
      },
    ],
  },
  {
    group: "More",
    items: [
      {
        name: "Resources",
        path: "/resources",
        icon: Download,
        children: [
          { name: "Downloads", path: "/resources", icon: Download },
          { name: "App-ads.txt", path: "/app-ads", icon: FileCode },
          { name: "Referral Program", path: "/referral", icon: Gift },
        ],
      },
      { name: "Settings", path: "/settings", icon: Sliders },
    ],
  },
];

/* ═══════════════════════════════════════
   HOVER POPUP (tooltip + flyout unified)
   - Hover se show hota hai
   - Bridge se stable rehta hai
   - Delay se close hota hai (300ms grace)
   - Links clickable hain (navigate karte hain)
   ═══════════════════════════════════════ */
const HoverPopup = ({ children, content, collapsed }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 250);
  }, []);

  if (!collapsed) return children;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      {visible && (
        <>
          {/* Bridge: invisible area between icon and popup to maintain hover */}
          <div
            style={{
              position: "absolute",
              left: "100%",
              top: 0,
              width: 18,
              height: "100%",
              zIndex: 9998,
            }}
          />

          {/* Popup */}
          <div
            style={{
              position: "absolute",
              left: "calc(100% + 12px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#151515",
              border: "1px solid rgba(3,217,133,0.2)",
              borderRadius: 10,
              padding: "4px 0",
              minWidth: "max-content",
              zIndex: 9999,
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.55), 0 0 20px rgba(3,217,133,0.06)",
            }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                left: -5,
                top: "50%",
                transform: "translateY(-50%) rotate(45deg)",
                width: 10,
                height: 10,
                background: "#151515",
                borderLeft: "1px solid rgba(3,217,133,0.2)",
                borderBottom: "1px solid rgba(3,217,133,0.2)",
              }}
            />
            {content}
          </div>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   NAV ITEM STYLE
   ═══════════════════════════════════════ */
const getNavStyle = (isActive, collapsed) => ({
  display: "flex",
  alignItems: "center",
  gap: collapsed ? 0 : 12,
  justifyContent: collapsed ? "center" : "flex-start",
  padding: collapsed ? "10px 0" : "10px 16px",
  fontSize: 14,
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
  textDecoration: "none",
  whiteSpace: "nowrap",
  width: "100%",
  border: "none",
  color: isActive ? "#03D985" : "#a0a0a0",
  background: isActive
    ? collapsed
      ? "rgba(3,217,133,0.12)"
      : "linear-gradient(90deg, rgba(3,217,133,0.12) 0%, transparent 100%)"
    : "transparent",
  borderLeft: collapsed
    ? "none"
    : isActive
    ? "3px solid #03D985"
    : "3px solid transparent",
  fontWeight: isActive ? 600 : 400,
});

/* ═══════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════ */
const Sidebar = ({
  collapsed,
  onToggle,
  isMobile,
  mobileOpen,
  onMobileClose,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  // On mobile, sidebar is always expanded width
  const effectiveCollapsed = isMobile ? false : collapsed;
  const w = effectiveCollapsed ? COLLAPSED_W : EXPANDED_W;

  const now = new Date();
  const formattedDate =
    now.toISOString().split("T")[0] +
    " " +
    now.toTimeString().split(" ")[0].slice(0, 5) +
    " GMT";

  // Close mobile sidebar on navigation
  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  /* ─── Hover Button ─── */
  const HoverBtn = ({ onClick, children, style: extraStyle }) => {
    const [h, setH] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          cursor: "pointer",
          transition: "all 0.2s",
          background: h ? "rgba(3,217,133,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${
            h ? "rgba(3,217,133,0.3)" : "rgba(255,255,255,0.08)"
          }`,
          color: h ? "#03D985" : "#666",
          flexShrink: 0,
          ...extraStyle,
        }}
      >
        {children}
      </button>
    );
  };

  /* ─── Render a single menu item ─── */
  const renderMenuItem = (item) => {
    if (item.divider) {
      return (
        <div
          key="divider"
          style={{
            margin: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        />
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isParentActive =
      hasChildren && location.pathname.startsWith(item.path);
    const isSubmenuOpen = openSubmenu === item.name;

    /* ── COLLAPSED MODE ── */
    if (effectiveCollapsed) {
      if (hasChildren) {
        // Flyout with clickable sub-links
        return (
          <HoverPopup
            key={item.name}
            collapsed={effectiveCollapsed}
            content={
              <div style={{ padding: "4px 0" }}>
                {/* Title */}
                <div
                  style={{
                    padding: "6px 14px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    marginBottom: 2,
                  }}
                >
                  {item.name}
                </div>
                {/* Sub-links */}
                {item.children.map((child) => (
                  <NavLink
                    key={child.name}
                    to={child.path}
                    onClick={handleNavClick}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 16px",
                      fontSize: 13,
                      textDecoration: "none",
                      color: isActive ? "#03D985" : "#909090",
                      fontWeight: isActive ? 600 : 400,
                      background: isActive
                        ? "rgba(3,217,133,0.06)"
                        : "transparent",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    })}
                  >
                    <child.icon
                      style={{ width: 14, height: 14, flexShrink: 0 }}
                    />
                    <span>{child.name}</span>
                  </NavLink>
                ))}
              </div>
            }
          >
            <div style={getNavStyle(isParentActive, effectiveCollapsed)}>
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
            </div>
          </HoverPopup>
        );
      }

      // Simple item with tooltip
      return (
        <HoverPopup
          key={item.name}
          collapsed={effectiveCollapsed}
          content={
            <NavLink
              to={item.path}
              end={item.end}
              onClick={handleNavClick}
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "4px 12px",
                display: "block",
                whiteSpace: "nowrap",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {item.name}
            </NavLink>
          }
        >
          <NavLink
            to={item.path}
            end={item.end}
            onClick={handleNavClick}
            style={({ isActive }) => getNavStyle(isActive, effectiveCollapsed)}
          >
            <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
          </NavLink>
        </HoverPopup>
      );
    }

    /* ── EXPANDED MODE ── */
    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
            style={{
              ...getNavStyle(isParentActive, effectiveCollapsed),
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span>{item.name}</span>
            </div>
            {isSubmenuOpen || isParentActive ? (
              <ChevronDown style={{ width: 16, height: 16, opacity: 0.6 }} />
            ) : (
              <ChevronRight style={{ width: 16, height: 16, opacity: 0.6 }} />
            )}
          </button>

          <div
            className={`sidebar-submenu ${
              isSubmenuOpen || isParentActive
                ? "sidebar-submenu-open"
                : "sidebar-submenu-closed"
            }`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "4px 0 4px 20px",
              }}
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.name}
                  to={child.path}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 16px",
                    fontSize: 14,
                    borderRadius: 6,
                    transition: "all 0.2s",
                    textDecoration: "none",
                    color: isActive ? "#03D985" : "#707070",
                    fontWeight: isActive ? 600 : 400,
                  })}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "currentColor",
                      opacity: 0.5,
                    }}
                  />
                  <span>{child.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Simple expanded item
    return (
      <NavLink
        key={item.name}
        to={item.path}
        end={item.end}
        onClick={handleNavClick}
        style={({ isActive }) => getNavStyle(isActive, effectiveCollapsed)}
      >
        <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  // Mobile: sidebar slides in/out as a drawer
  const sidebarStyle = isMobile
    ? {
        position: "fixed",
        left: 0,
        top: 0,
        width: EXPANDED_W,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        background: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "visible",
      }
    : {
        position: "fixed",
        left: 0,
        top: 0,
        width: w,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        background: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "visible",
      };

  return (
    <aside style={sidebarStyle}>
      {/* ── Bottom Green Gradient Glow ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "45%",
          background:
            "radial-gradient(ellipse at 10% 100%, rgba(22, 214, 124, 0.38) 0%, rgba(3, 217, 131, 0.25) 35%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ═══ LOGO ROW + COLLAPSE / CLOSE ═══ */}
      <div
        style={{
          padding: effectiveCollapsed ? "20px 12px 8px" : "20px 16px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "space-between",
          position: "relative",
          zIndex: 10,
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#03D985",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(3,217,133,0.3)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#000", fontWeight: 700, fontSize: 16 }}>
              C
            </span>
          </div>
          {!effectiveCollapsed && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              cinfy<span style={{ color: "#03D985" }}>.io</span>
            </span>
          )}
        </div>
        {!effectiveCollapsed && !isMobile && (
          <HoverBtn onClick={onToggle}>
            <ChevronsLeft style={{ width: 14, height: 14 }} />
          </HoverBtn>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      {effectiveCollapsed && !isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "4px 0",
            position: "relative",
            zIndex: 10,
          }}
        >
          <HoverBtn onClick={onToggle} style={{ width: 36, height: 26 }}>
            <ChevronsRight style={{ width: 14, height: 14 }} />
          </HoverBtn>
        </div>
      )}

      {/* ═══ PUBLISHER BADGE ═══ */}
      <div
        style={{
          padding: effectiveCollapsed ? "16px 8px 0" : "16px 16px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {effectiveCollapsed ? (
          <HoverPopup
            collapsed={effectiveCollapsed}
            content={
              <div
                style={{
                  padding: "4px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Publisher
              </div>
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0",
                borderRadius: 8,
                background: "#03D985",
                cursor: "pointer",
              }}
            >
              <Globe style={{ width: 18, height: 18, color: "#000" }} />
            </div>
          </HoverPopup>
        ) : (
          <button className="sidebar-publisher-badge" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Globe style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
                Publisher
              </span>
            </div>
            <ChevronRight
              style={{ width: 16, height: 16, color: "rgba(0,0,0,0.5)" }}
            />
          </button>
        )}
      </div>

      {/* ═══ DYNAMIC NAV AREA ═══ */}
      <nav
        className={effectiveCollapsed ? "" : "sidebar-scroll"}
        style={{
          flex: 1,
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          overflowY: effectiveCollapsed ? "visible" : "auto",
          overflowX: effectiveCollapsed ? "visible" : "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: effectiveCollapsed ? "0 8px" : "0 12px",
          }}
        >
          {MENU_CONFIG.map((group, groupIdx) => (
            <div
              key={group.group || groupIdx}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {!effectiveCollapsed && (
                <div
                  style={{
                    padding: "0 16px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#444",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.items.map((item, itemIdx) => (
                <React.Fragment key={item.name || itemIdx}>
                  {renderMenuItem(item)}
                </React.Fragment>
              ))}
              {groupIdx < MENU_CONFIG.length - 1 && effectiveCollapsed && (
                <div
                  style={{
                    margin: "8px 12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ═══ USER PROFILE FOOTER ═══ */}
      <div
        style={{
          padding: effectiveCollapsed ? "8px" : "8px 16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {effectiveCollapsed ? (
          <HoverPopup
            collapsed={effectiveCollapsed}
            content={
              <NavLink
                to="/profile"
                onClick={handleNavClick}
                style={{
                  padding: "4px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Ankit Jatav
              </NavLink>
            }
          >
            <NavLink
              to="/profile"
              onClick={handleNavClick}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 0",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#03D985",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  boxShadow: "0 0 12px rgba(3,217,133,0.3)",
                  cursor: "pointer",
                }}
              >
                AJ
              </div>
            </NavLink>
          </HoverPopup>
        ) : (
          <>
            <NavLink
              to="/profile"
              onClick={handleNavClick}
              style={{ textDecoration: "none" }}
            >
              <div className="sidebar-user-card">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#03D985",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                    boxShadow: "0 0 12px rgba(3,217,133,0.3)",
                  }}
                >
                  AJ
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ankit Jatav
                    </span>
                    <ChevronUp
                      style={{
                        width: 14,
                        height: 14,
                        color: "#03D985",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "#606060" }}>
                    ID# 131364877
                  </span>
                </div>
              </div>
            </NavLink>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 10,
                paddingLeft: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#03D985",
                }}
              />
              <span style={{ fontSize: 11, color: "#505050" }}>
                {formattedDate}
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
