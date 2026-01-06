'use client'

import { useEffect } from 'react'

export function MDXDebugLogger() {
  useEffect(() => {
    // #region agent log
    const container = document.querySelector('.p-4.md\\:p-8.max-w-3xl.mx-auto');
    const hasProse = container?.classList.contains('prose');
    const headings = container?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingCount = headings?.length || 0;
    const firstHeading = headings?.[0];
    const firstHeadingStyles = firstHeading ? window.getComputedStyle(firstHeading as Element) : null;
    const paragraphs = container?.querySelectorAll('p');
    const firstParagraph = paragraphs?.[0];
    const firstParagraphStyles = firstParagraph ? window.getComputedStyle(firstParagraph as Element) : null;
    
    fetch('http://127.0.0.1:7242/ingest/8cc1bcb1-7050-4aae-9727-46d9013cd8c8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/pages/_components/MDXDebugLogger.tsx:15',message:'MDX layout DOM analysis',data:{hasProseClass:hasProse,containerClasses:container ? Array.from(container.classList) : [],headingCount,firstHeadingTag:firstHeading?.tagName,firstHeadingFontSize:firstHeadingStyles?.fontSize,firstHeadingFontWeight:firstHeadingStyles?.fontWeight,firstHeadingMarginTop:firstHeadingStyles?.marginTop,firstParagraphFontSize:firstParagraphStyles?.fontSize,firstParagraphFontWeight:firstParagraphStyles?.fontWeight},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }, []);

  return null;
}

