// // components/HeroMockup.tsx
// import Image from "next/image";

// export default function HeroMockup() {
//   return (
//     <div className="relative mx-auto max-w-7xl px-6">
//       {/* This SVG is your exact mockup */}
//       <svg
//         width="1280"
//         height="737"
//         viewBox="0 0 1280 737"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         xmlnsXlink="http://www.w3.org/1999/xlink"
//         className="w-full h-auto drop-shadow-2xl"
//         // Optional: animate on scroll
//         // data-aos="fade-up" if you use AOS
//       >
//         {/* ←←← Paste your entire <svg>… content here ←←← */}
//         {/* Just replace the <image> href below with your real screenshot */}
//         <defs>
//           {/* This is the magic line — your actual app screenshot */}
//           <pattern
//             id="app-screenshot"
//             patternContentUnits="objectBoundingBox"
//             width="1"
//             height="1"
//           >
//             <use xlinkHref="#image0" transform="scale(0.000251383 0.000393546)" />
//           </pattern>

//           {/* Your real app screenshot (hosted or local) */}
//           <image
//             id="image0"
//             width="3978"
//             height="2500"
//             xlinkHref="/dashboard-screenshot.webp"   {/* ←←← CHANGE THIS */}
//             // or use a live URL:
//             // xlinkHref="https://yoursite.com/screenshot.webp"
//           />
//         </defs>

//         {/* Paste everything else from your original SVG exactly as-is */}
//         <g filter="url(#filter0_dddddd_3051_12573)">
//           {/* ... all the <g>, <rect>, <path> etc. you posted ... */}
//           {/* Just make sure this line uses the pattern we defined above: */}
//           <rect
//             fill="url(#app-screenshot)"   {/* ← this pulls in your real screenshot */}
//             height="702.001"
//             transform="matrix(0.965926 -0.258819 0.707107 0.707107 109.154 384.939)"
//             width="1099"
//           />
//           {/* ... rest of your SVG ... */}
//         </g>
//         {/* ... keep all filters, gradients, clips exactly the same ... */}
//       </svg>
//     </div>
//   );
// }