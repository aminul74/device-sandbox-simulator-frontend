import React, { useRef } from "react";
import type { PlacedDevice as PD } from "../types";

interface Props {
  item: PD;
  onMove: (id: string, x: number, y: number) => void;
  onSelect?: (id: string) => void;
}

// Displays a single placed device on the canvas with drag support and visual effects
export default function PlacedDevice({ item, onMove, onSelect }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<{ dx: number; dy: number } | null>(null);
  const uidRef = useRef<string>(Math.random().toString(36).slice(2, 9));

  // Handle pointer down to start dragging
  function onPointerDown(e: React.PointerEvent) {
    const el = elRef.current;
    if (!el) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    draggingRef.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp, { once: true });
    if (onSelect) onSelect(item.id);
  }

  // Update device position while dragging
  function pointerMove(e: PointerEvent) {
    const canvas = elRef.current?.parentElement?.getBoundingClientRect();
    if (!canvas || !draggingRef.current) return;
    const x = e.clientX - canvas.left - draggingRef.current.dx;
    const y = e.clientY - canvas.top - draggingRef.current.dy;
    onMove(item.id, Math.max(0, x), Math.max(0, y));
  }

  // Stop dragging
  function pointerUp() {
    draggingRef.current = null;
    window.removeEventListener("pointermove", pointerMove);
  }

  // Calculate brightness level and glow effects
  const brightness = item.brightness ?? 0;
  const hasLight = item.type === "light" && !!item.power;
  const effectiveBrightness = hasLight ? Math.max(15, brightness) : brightness;

  // Glow filter for light devices
  const glowStyle: React.CSSProperties | undefined = hasLight
    ? {
        filter: `drop-shadow(0 0 ${20 + effectiveBrightness / 3}px ${
          item.color ?? "#ffdca6"
        }66) drop-shadow(0 0 80px ${item.color ?? "#ffdca6"}33)`,
      }
    : undefined;

  const haloStyle: React.CSSProperties | undefined = hasLight
    ? {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${220 + effectiveBrightness * 2}px`,
        height: `${220 + effectiveBrightness * 2}px`,
        background: `radial-gradient(circle, ${
          item.color ?? "#ffdca6"
        } 0%, rgba(255,255,255,0) 60%)`,
        filter: `blur(${Math.max(18, effectiveBrightness / 3)}px)`,
        opacity: Math.min(1, (effectiveBrightness / 100) * 0.95),
        zIndex: 0,
        pointerEvents: "none",
        borderRadius: "50%",
      }
    : undefined;

  const src =
    item.type === "light"
      ? new URL("../assets/light.svg", import.meta.url).href
      : new URL("../assets/fan.svg", import.meta.url).href;

  const rotorStyle: React.CSSProperties | undefined =
    item.type === "fan" && item.power
      ? {
          animationDuration: `${Math.max(
            0.12,
            2 - ((item.speed ?? 60) / 100) * 1.6
          )}s`,
        }
      : undefined;

  return (
    <div
      ref={elRef}
      onPointerDown={onPointerDown}
      style={{
        left: item.x,
        top: item.y,
        background: "transparent",
      }}
      className="absolute w-32 h-32 flex items-center justify-center select-none touch-none"
    >
      {item.type === "fan" ? (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "transparent", border: "none" }}
        >
          <img
            src={src}
            alt={item.type}
            className={`w-full h-full object-contain ${
              item.power ? "spin" : ""
            }`}
            style={{
              ...rotorStyle,
              background: "transparent",
              border: "none",
            }}
          />
        </div>
      ) : (
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            background: "transparent",
            border: "none",
            overflow: "visible",
            ...glowStyle,
          }}
        >
          {hasLight && <div style={haloStyle} />}

          {item.power ? (
            <svg
              viewBox="0 0 248 280"
              width="128"
              height="128"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
              style={{
                position: "relative",
                zIndex: 1,
                background: "transparent",
                border: "none",
                display: "block",
              }}
            >
              <defs>
                <linearGradient
                  id={`cap_grad_${uidRef.current}`}
                  x1="124"
                  y1="24"
                  x2="124"
                  y2="36"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A5565" />
                  <stop offset="1" stopColor="#364153" />
                </linearGradient>

                <radialGradient
                  id={`bulb_on_${uidRef.current}`}
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(98.4 108) rotate(-90) scale(143.43 143.43)"
                >
                  <stop stopColor={item.color ?? "#FFE5B4"} />
                  <stop
                    offset="0.5"
                    stopColor={item.color ?? "#FFE5B4"}
                    stopOpacity="0.867"
                  />
                  <stop
                    offset="1"
                    stopColor={item.color ?? "#FFE5B4"}
                    stopOpacity="0.6"
                  />
                </radialGradient>

                <linearGradient
                  id={`inner_glow_${uidRef.current}`}
                  x1="92"
                  y1="92"
                  x2="153.44"
                  y2="138.08"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.8" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>

                <linearGradient
                  id={`vertical_highlight_${uidRef.current}`}
                  x1="124"
                  y1="108"
                  x2="124"
                  y2="172"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor={item.color ?? "#FFE5B4"} />
                  <stop offset="1" stopColor="white" />
                </linearGradient>

                <filter
                  id={`bulb_effects_${uidRef.current}`}
                  x="0"
                  y="0"
                  width="248"
                  height="280"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="30" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0.705882 0 0 0 0.6 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0.705882 0 0 0 0.4 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect2_innerShadow"
                  />
                </filter>

                <filter
                  id={`inner_glow_blur_${uidRef.current}`}
                  x="76"
                  y="76"
                  width="80"
                  height="96"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="8"
                    result="effect1_foregroundBlur"
                  />
                </filter>

                <filter
                  id={`highlight_shadow_${uidRef.current}`}
                  x="112"
                  y="98"
                  width="24"
                  height="84"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0.705882 0 0 0 1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>

              <path
                d="M92 30C92 26.6863 94.6863 24 98 24H150C153.314 24 156 26.6863 156 30V36H92V30Z"
                fill={`url(#cap_grad_${uidRef.current})`}
              />

              <mask id={`path-2-inside-1_${uidRef.current}`} fill="white">
                <path d="M84 36H164V40H84V36Z" />
              </mask>
              <path d="M84 36H164V40H84V36Z" fill="#364153" />
              <path
                d="M164 40V39H84V40V41H164V40Z"
                fill="#4A5565"
                mask={`url(#path-2-inside-1_${uidRef.current})`}
              />

              <mask id={`path-4-inside-2_${uidRef.current}`} fill="white">
                <path d="M84 40H164V44H84V40Z" />
              </mask>
              <path d="M84 40H164V44H84V40Z" fill="#364153" />
              <path
                d="M164 44V43H84V44V45H164V44Z"
                fill="#4A5565"
                mask={`url(#path-4-inside-2_${uidRef.current})`}
              />

              <mask id={`path-6-inside-3_${uidRef.current}`} fill="white">
                <path d="M84 44H164V48H84V44Z" />
              </mask>
              <path d="M84 44H164V48H84V44Z" fill="#364153" />
              <path
                d="M164 48V47H84V48V49H164V48Z"
                fill="#4A5565"
                mask={`url(#path-6-inside-3_${uidRef.current})`}
              />

              <mask id={`path-8-inside-4_${uidRef.current}`} fill="white">
                <path d="M84 48H164V52H84V48Z" />
              </mask>
              <path d="M84 48H164V52H84V48Z" fill="#364153" />
              <path
                d="M164 52V51H84V52V53H164V52Z"
                fill="#4A5565"
                mask={`url(#path-8-inside-4_${uidRef.current})`}
              />

              <g filter={`url(#bulb_effects_${uidRef.current})`}>
                <path
                  d="M60 124C60 88.6538 88.6538 60 124 60C159.346 60 188 88.6538 188 124V156C188 191.346 159.346 220 124 220C88.6538 220 60 191.346 60 156V124Z"
                  fill={`url(#bulb_on_${uidRef.current})`}
                  shapeRendering="crispEdges"
                />

                {hasLight && (
                  <g
                    opacity="0.4"
                    filter={`url(#inner_glow_blur_${uidRef.current})`}
                  >
                    <path
                      d="M92 116C92 102.745 102.745 92 116 92C129.255 92 140 102.745 140 116V132C140 145.255 129.255 156 116 156C102.745 156 92 145.255 92 132V116Z"
                      fill={`url(#inner_glow_${uidRef.current})`}
                    />
                  </g>
                )}

                {hasLight && (
                  <g filter={`url(#highlight_shadow_${uidRef.current})`}>
                    <path
                      d="M122 110C122 108.895 122.895 108 124 108C125.105 108 126 108.895 126 110V170C126 171.105 125.105 172 124 172C122.895 172 122 171.105 122 170V110Z"
                      fill={`url(#vertical_highlight_${uidRef.current})`}
                    />
                  </g>
                )}
              </g>
            </svg>
          ) : (
            <svg
              viewBox="0 0 248 280"
              width="128"
              height="128"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none"
              style={{
                position: "relative",
                zIndex: 1,
                background: "transparent",
                border: "none",
                display: "block",
              }}
            >
              <defs>
                <linearGradient
                  id={`cap_grad_off_${uidRef.current}`}
                  x1="124"
                  y1="24"
                  x2="124"
                  y2="36"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A5565" />
                  <stop offset="1" stopColor="#364153" />
                </linearGradient>

                <radialGradient
                  id={`bulb_off_${uidRef.current}`}
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(98.4 108) rotate(-90) scale(143.43 143.43)"
                >
                  <stop stopColor="#4A5568" />
                  <stop offset="0.5" stopColor="#2D3748" />
                  <stop offset="1" stopColor="#1A202C" />
                </radialGradient>

                <linearGradient
                  id={`inner_highlight_off_${uidRef.current}`}
                  x1="92"
                  y1="92"
                  x2="153.44"
                  y2="138.08"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.8" />
                  <stop offset="1" stopOpacity="0" />
                </linearGradient>

                <filter
                  id={`bulb_off_shadow_${uidRef.current}`}
                  x="0"
                  y="0"
                  width="248"
                  height="280"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="10" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow"
                  />
                </filter>

                <filter
                  id={`inner_blur_off_${uidRef.current}`}
                  x="76"
                  y="76"
                  width="80"
                  height="96"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="8"
                    result="effect1_foregroundBlur"
                  />
                </filter>
              </defs>

              <path
                d="M92 30C92 26.6863 94.6863 24 98 24H150C153.314 24 156 26.6863 156 30V36H92V30Z"
                fill={`url(#cap_grad_off_${uidRef.current})`}
              />

              <mask id={`path-2-off-${uidRef.current}`} fill="white">
                <path d="M84 36H164V40H84V36Z" />
              </mask>
              <path d="M84 36H164V40H84V36Z" fill="#364153" />
              <path
                d="M164 40V39H84V40V41H164V40Z"
                fill="#4A5565"
                mask={`url(#path-2-off-${uidRef.current})`}
              />

              <mask id={`path-4-off-${uidRef.current}`} fill="white">
                <path d="M84 40H164V44H84V40Z" />
              </mask>
              <path d="M84 40H164V44H84V40Z" fill="#364153" />
              <path
                d="M164 44V43H84V44V45H164V44Z"
                fill="#4A5565"
                mask={`url(#path-4-off-${uidRef.current})`}
              />

              <mask id={`path-6-off-${uidRef.current}`} fill="white">
                <path d="M84 44H164V48H84V44Z" />
              </mask>
              <path d="M84 44H164V48H84V44Z" fill="#364153" />
              <path
                d="M164 48V47H84V48V49H164V48Z"
                fill="#4A5565"
                mask={`url(#path-6-off-${uidRef.current})`}
              />

              <mask id={`path-8-off-${uidRef.current}`} fill="white">
                <path d="M84 48H164V52H84V48Z" />
              </mask>
              <path d="M84 48H164V52H84V48Z" fill="#364153" />
              <path
                d="M164 52V51H84V52V53H164V52Z"
                fill="#4A5565"
                mask={`url(#path-8-off-${uidRef.current})`}
              />

              <g filter={`url(#bulb_off_shadow_${uidRef.current})`}>
                <path
                  d="M60 124C60 88.6538 88.6538 60 124 60C159.346 60 188 88.6538 188 124V156C188 191.346 159.346 220 124 220C88.6538 220 60 191.346 60 156V124Z"
                  fill={`url(#bulb_off_${uidRef.current})`}
                />

                <g
                  opacity="0.4"
                  filter={`url(#inner_blur_off_${uidRef.current})`}
                >
                  <path
                    d="M92 116C92 102.745 102.745 92 116 92C129.255 92 140 102.745 140 116V132C140 145.255 129.255 156 116 156C102.745 156 92 145.255 92 132V116Z"
                    fill={`url(#inner_highlight_off_${uidRef.current})`}
                  />
                </g>
              </g>
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
