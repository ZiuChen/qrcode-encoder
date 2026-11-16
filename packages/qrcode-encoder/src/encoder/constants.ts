import type { ErrorCorrectionLevel, VersionECInfo } from './types'

// 各 ECC 等级各版本块配置 (ISO 18004 Table 9)
// 键: ErrorCorrectionLevel ('L'|'M'|'Q'|'H')
// 索引 0 为占位符，有效版本从 1 到 40
export const VERSION_EC_TABLES: Record<ErrorCorrectionLevel, VersionECInfo[]> = {
  // ---- ECC-L (indicator 0b01) ----
  L: [
    { totalCodewords: 0, groups: [] }, // V0 placeholder
    { totalCodewords: 26, groups: [{ count: 1, dataCodewords: 19 }] }, // V1
    { totalCodewords: 44, groups: [{ count: 1, dataCodewords: 34 }] }, // V2
    { totalCodewords: 70, groups: [{ count: 1, dataCodewords: 55 }] }, // V3
    { totalCodewords: 100, groups: [{ count: 1, dataCodewords: 80 }] }, // V4
    { totalCodewords: 134, groups: [{ count: 1, dataCodewords: 108 }] }, // V5
    { totalCodewords: 172, groups: [{ count: 2, dataCodewords: 68 }] }, // V6
    { totalCodewords: 196, groups: [{ count: 2, dataCodewords: 78 }] }, // V7
    { totalCodewords: 242, groups: [{ count: 2, dataCodewords: 97 }] }, // V8
    { totalCodewords: 292, groups: [{ count: 2, dataCodewords: 116 }] }, // V9
    {
      totalCodewords: 346,
      groups: [
        { count: 2, dataCodewords: 68 },
        { count: 2, dataCodewords: 69 }
      ]
    }, // V10
    { totalCodewords: 404, groups: [{ count: 4, dataCodewords: 81 }] }, // V11
    {
      totalCodewords: 466,
      groups: [
        { count: 2, dataCodewords: 92 },
        { count: 2, dataCodewords: 93 }
      ]
    }, // V12
    { totalCodewords: 532, groups: [{ count: 4, dataCodewords: 107 }] }, // V13
    {
      totalCodewords: 581,
      groups: [
        { count: 3, dataCodewords: 115 },
        { count: 1, dataCodewords: 116 }
      ]
    }, // V14
    {
      totalCodewords: 655,
      groups: [
        { count: 5, dataCodewords: 87 },
        { count: 1, dataCodewords: 88 }
      ]
    }, // V15
    {
      totalCodewords: 733,
      groups: [
        { count: 5, dataCodewords: 98 },
        { count: 1, dataCodewords: 99 }
      ]
    }, // V16
    {
      totalCodewords: 815,
      groups: [
        { count: 1, dataCodewords: 107 },
        { count: 5, dataCodewords: 108 }
      ]
    }, // V17
    {
      totalCodewords: 901,
      groups: [
        { count: 5, dataCodewords: 120 },
        { count: 1, dataCodewords: 121 }
      ]
    }, // V18
    {
      totalCodewords: 991,
      groups: [
        { count: 3, dataCodewords: 113 },
        { count: 4, dataCodewords: 114 }
      ]
    }, // V19
    {
      totalCodewords: 1085,
      groups: [
        { count: 3, dataCodewords: 107 },
        { count: 5, dataCodewords: 108 }
      ]
    }, // V20
    {
      totalCodewords: 1156,
      groups: [
        { count: 4, dataCodewords: 116 },
        { count: 4, dataCodewords: 117 }
      ]
    }, // V21
    {
      totalCodewords: 1258,
      groups: [
        { count: 2, dataCodewords: 111 },
        { count: 7, dataCodewords: 112 }
      ]
    }, // V22
    {
      totalCodewords: 1364,
      groups: [
        { count: 4, dataCodewords: 121 },
        { count: 5, dataCodewords: 122 }
      ]
    }, // V23
    {
      totalCodewords: 1474,
      groups: [
        { count: 6, dataCodewords: 117 },
        { count: 4, dataCodewords: 118 }
      ]
    }, // V24
    {
      totalCodewords: 1588,
      groups: [
        { count: 8, dataCodewords: 106 },
        { count: 4, dataCodewords: 107 }
      ]
    }, // V25
    {
      totalCodewords: 1706,
      groups: [
        { count: 10, dataCodewords: 114 },
        { count: 2, dataCodewords: 115 }
      ]
    }, // V26
    {
      totalCodewords: 1828,
      groups: [
        { count: 8, dataCodewords: 122 },
        { count: 4, dataCodewords: 123 }
      ]
    }, // V27
    {
      totalCodewords: 1921,
      groups: [
        { count: 3, dataCodewords: 117 },
        { count: 10, dataCodewords: 118 }
      ]
    }, // V28
    {
      totalCodewords: 2051,
      groups: [
        { count: 7, dataCodewords: 116 },
        { count: 7, dataCodewords: 117 }
      ]
    }, // V29
    {
      totalCodewords: 2185,
      groups: [
        { count: 5, dataCodewords: 115 },
        { count: 10, dataCodewords: 116 }
      ]
    }, // V30
    {
      totalCodewords: 2323,
      groups: [
        { count: 13, dataCodewords: 115 },
        { count: 3, dataCodewords: 116 }
      ]
    }, // V31
    { totalCodewords: 2465, groups: [{ count: 17, dataCodewords: 115 }] }, // V32
    {
      totalCodewords: 2611,
      groups: [
        { count: 17, dataCodewords: 115 },
        { count: 1, dataCodewords: 116 }
      ]
    }, // V33
    {
      totalCodewords: 2761,
      groups: [
        { count: 13, dataCodewords: 115 },
        { count: 6, dataCodewords: 116 }
      ]
    }, // V34
    {
      totalCodewords: 2876,
      groups: [
        { count: 12, dataCodewords: 121 },
        { count: 7, dataCodewords: 122 }
      ]
    }, // V35
    {
      totalCodewords: 3034,
      groups: [
        { count: 6, dataCodewords: 121 },
        { count: 14, dataCodewords: 122 }
      ]
    }, // V36
    {
      totalCodewords: 3196,
      groups: [
        { count: 17, dataCodewords: 122 },
        { count: 4, dataCodewords: 123 }
      ]
    }, // V37
    {
      totalCodewords: 3362,
      groups: [
        { count: 4, dataCodewords: 122 },
        { count: 18, dataCodewords: 123 }
      ]
    }, // V38
    {
      totalCodewords: 3532,
      groups: [
        { count: 20, dataCodewords: 117 },
        { count: 4, dataCodewords: 118 }
      ]
    }, // V39
    {
      totalCodewords: 3706,
      groups: [
        { count: 19, dataCodewords: 118 },
        { count: 6, dataCodewords: 119 }
      ]
    } // V40
  ],

  // ---- ECC-M (indicator 0b00) ----
  M: [
    { totalCodewords: 0, groups: [] }, // V0 placeholder
    { totalCodewords: 26, groups: [{ count: 1, dataCodewords: 16 }] }, // V1
    { totalCodewords: 44, groups: [{ count: 1, dataCodewords: 28 }] }, // V2
    { totalCodewords: 70, groups: [{ count: 1, dataCodewords: 44 }] }, // V3
    { totalCodewords: 100, groups: [{ count: 2, dataCodewords: 32 }] }, // V4
    { totalCodewords: 134, groups: [{ count: 2, dataCodewords: 43 }] }, // V5
    { totalCodewords: 172, groups: [{ count: 4, dataCodewords: 27 }] }, // V6
    { totalCodewords: 196, groups: [{ count: 4, dataCodewords: 31 }] }, // V7
    {
      totalCodewords: 242,
      groups: [
        { count: 2, dataCodewords: 38 },
        { count: 2, dataCodewords: 39 }
      ]
    }, // V8
    {
      totalCodewords: 292,
      groups: [
        { count: 3, dataCodewords: 36 },
        { count: 2, dataCodewords: 37 }
      ]
    }, // V9
    {
      totalCodewords: 346,
      groups: [
        { count: 4, dataCodewords: 43 },
        { count: 1, dataCodewords: 44 }
      ]
    }, // V10
    {
      totalCodewords: 404,
      groups: [
        { count: 1, dataCodewords: 50 },
        { count: 4, dataCodewords: 51 }
      ]
    }, // V11
    {
      totalCodewords: 466,
      groups: [
        { count: 6, dataCodewords: 36 },
        { count: 2, dataCodewords: 37 }
      ]
    }, // V12
    {
      totalCodewords: 532,
      groups: [
        { count: 8, dataCodewords: 37 },
        { count: 1, dataCodewords: 38 }
      ]
    }, // V13
    {
      totalCodewords: 581,
      groups: [
        { count: 4, dataCodewords: 40 },
        { count: 5, dataCodewords: 41 }
      ]
    }, // V14
    {
      totalCodewords: 655,
      groups: [
        { count: 5, dataCodewords: 41 },
        { count: 5, dataCodewords: 42 }
      ]
    }, // V15
    {
      totalCodewords: 733,
      groups: [
        { count: 7, dataCodewords: 45 },
        { count: 3, dataCodewords: 46 }
      ]
    }, // V16
    {
      totalCodewords: 815,
      groups: [
        { count: 10, dataCodewords: 46 },
        { count: 1, dataCodewords: 47 }
      ]
    }, // V17
    {
      totalCodewords: 901,
      groups: [
        { count: 9, dataCodewords: 43 },
        { count: 4, dataCodewords: 44 }
      ]
    }, // V18
    {
      totalCodewords: 991,
      groups: [
        { count: 3, dataCodewords: 44 },
        { count: 11, dataCodewords: 45 }
      ]
    }, // V19
    {
      totalCodewords: 1085,
      groups: [
        { count: 3, dataCodewords: 41 },
        { count: 13, dataCodewords: 42 }
      ]
    }, // V20
    { totalCodewords: 1156, groups: [{ count: 17, dataCodewords: 42 }] }, // V21
    { totalCodewords: 1258, groups: [{ count: 17, dataCodewords: 46 }] }, // V22 (fixed: was erroneously [{17,46},{1,47}])
    {
      totalCodewords: 1364,
      groups: [
        { count: 4, dataCodewords: 47 },
        { count: 14, dataCodewords: 48 }
      ]
    }, // V23
    {
      totalCodewords: 1474,
      groups: [
        { count: 6, dataCodewords: 45 },
        { count: 14, dataCodewords: 46 }
      ]
    }, // V24
    {
      totalCodewords: 1588,
      groups: [
        { count: 8, dataCodewords: 47 },
        { count: 13, dataCodewords: 48 }
      ]
    }, // V25
    {
      totalCodewords: 1706,
      groups: [
        { count: 19, dataCodewords: 46 },
        { count: 4, dataCodewords: 47 }
      ]
    }, // V26
    {
      totalCodewords: 1828,
      groups: [
        { count: 22, dataCodewords: 45 },
        { count: 3, dataCodewords: 46 }
      ]
    }, // V27
    {
      totalCodewords: 1921,
      groups: [
        { count: 3, dataCodewords: 45 },
        { count: 23, dataCodewords: 46 }
      ]
    }, // V28
    {
      totalCodewords: 2051,
      groups: [
        { count: 21, dataCodewords: 45 },
        { count: 7, dataCodewords: 46 }
      ]
    }, // V29
    {
      totalCodewords: 2185,
      groups: [
        { count: 19, dataCodewords: 47 },
        { count: 10, dataCodewords: 48 }
      ]
    }, // V30
    {
      totalCodewords: 2323,
      groups: [
        { count: 2, dataCodewords: 46 },
        { count: 29, dataCodewords: 47 }
      ]
    }, // V31
    {
      totalCodewords: 2465,
      groups: [
        { count: 10, dataCodewords: 46 },
        { count: 23, dataCodewords: 47 }
      ]
    }, // V32
    {
      totalCodewords: 2611,
      groups: [
        { count: 14, dataCodewords: 46 },
        { count: 21, dataCodewords: 47 }
      ]
    }, // V33
    {
      totalCodewords: 2761,
      groups: [
        { count: 14, dataCodewords: 46 },
        { count: 23, dataCodewords: 47 }
      ]
    }, // V34
    {
      totalCodewords: 2876,
      groups: [
        { count: 12, dataCodewords: 47 },
        { count: 26, dataCodewords: 48 }
      ]
    }, // V35
    {
      totalCodewords: 3034,
      groups: [
        { count: 6, dataCodewords: 47 },
        { count: 34, dataCodewords: 48 }
      ]
    }, // V36
    {
      totalCodewords: 3196,
      groups: [
        { count: 29, dataCodewords: 46 },
        { count: 14, dataCodewords: 47 }
      ]
    }, // V37
    {
      totalCodewords: 3362,
      groups: [
        { count: 13, dataCodewords: 46 },
        { count: 32, dataCodewords: 47 }
      ]
    }, // V38
    {
      totalCodewords: 3532,
      groups: [
        { count: 40, dataCodewords: 47 },
        { count: 7, dataCodewords: 48 }
      ]
    }, // V39
    {
      totalCodewords: 3706,
      groups: [
        { count: 18, dataCodewords: 47 },
        { count: 31, dataCodewords: 48 }
      ]
    } // V40
  ],

  // ---- ECC-Q (indicator 0b11) ----
  Q: [
    { totalCodewords: 0, groups: [] }, // V0 placeholder
    { totalCodewords: 26, groups: [{ count: 1, dataCodewords: 13 }] }, // V1
    { totalCodewords: 44, groups: [{ count: 1, dataCodewords: 22 }] }, // V2
    { totalCodewords: 70, groups: [{ count: 2, dataCodewords: 17 }] }, // V3
    { totalCodewords: 100, groups: [{ count: 2, dataCodewords: 24 }] }, // V4
    {
      totalCodewords: 134,
      groups: [
        { count: 2, dataCodewords: 15 },
        { count: 2, dataCodewords: 16 }
      ]
    }, // V5
    { totalCodewords: 172, groups: [{ count: 4, dataCodewords: 19 }] }, // V6
    {
      totalCodewords: 196,
      groups: [
        { count: 2, dataCodewords: 14 },
        { count: 4, dataCodewords: 15 }
      ]
    }, // V7
    {
      totalCodewords: 242,
      groups: [
        { count: 4, dataCodewords: 18 },
        { count: 2, dataCodewords: 19 }
      ]
    }, // V8
    {
      totalCodewords: 292,
      groups: [
        { count: 4, dataCodewords: 16 },
        { count: 4, dataCodewords: 17 }
      ]
    }, // V9
    {
      totalCodewords: 346,
      groups: [
        { count: 6, dataCodewords: 19 },
        { count: 2, dataCodewords: 20 }
      ]
    }, // V10
    {
      totalCodewords: 404,
      groups: [
        { count: 4, dataCodewords: 22 },
        { count: 4, dataCodewords: 23 }
      ]
    }, // V11
    {
      totalCodewords: 466,
      groups: [
        { count: 4, dataCodewords: 20 },
        { count: 6, dataCodewords: 21 }
      ]
    }, // V12
    {
      totalCodewords: 532,
      groups: [
        { count: 8, dataCodewords: 20 },
        { count: 4, dataCodewords: 21 }
      ]
    }, // V13
    {
      totalCodewords: 581,
      groups: [
        { count: 11, dataCodewords: 16 },
        { count: 5, dataCodewords: 17 }
      ]
    }, // V14
    {
      totalCodewords: 655,
      groups: [
        { count: 5, dataCodewords: 24 },
        { count: 7, dataCodewords: 25 }
      ]
    }, // V15
    {
      totalCodewords: 733,
      groups: [
        { count: 15, dataCodewords: 19 },
        { count: 2, dataCodewords: 20 }
      ]
    }, // V16
    {
      totalCodewords: 815,
      groups: [
        { count: 1, dataCodewords: 22 },
        { count: 15, dataCodewords: 23 }
      ]
    }, // V17
    {
      totalCodewords: 901,
      groups: [
        { count: 17, dataCodewords: 22 },
        { count: 1, dataCodewords: 23 }
      ]
    }, // V18
    {
      totalCodewords: 991,
      groups: [
        { count: 17, dataCodewords: 21 },
        { count: 4, dataCodewords: 22 }
      ]
    }, // V19
    {
      totalCodewords: 1085,
      groups: [
        { count: 15, dataCodewords: 24 },
        { count: 5, dataCodewords: 25 }
      ]
    }, // V20
    {
      totalCodewords: 1156,
      groups: [
        { count: 17, dataCodewords: 22 },
        { count: 6, dataCodewords: 23 }
      ]
    }, // V21
    {
      totalCodewords: 1258,
      groups: [
        { count: 7, dataCodewords: 24 },
        { count: 16, dataCodewords: 25 }
      ]
    }, // V22
    {
      totalCodewords: 1364,
      groups: [
        { count: 11, dataCodewords: 24 },
        { count: 14, dataCodewords: 25 }
      ]
    }, // V23
    {
      totalCodewords: 1474,
      groups: [
        { count: 11, dataCodewords: 24 },
        { count: 16, dataCodewords: 25 }
      ]
    }, // V24
    {
      totalCodewords: 1588,
      groups: [
        { count: 7, dataCodewords: 24 },
        { count: 22, dataCodewords: 25 }
      ]
    }, // V25
    {
      totalCodewords: 1706,
      groups: [
        { count: 28, dataCodewords: 22 },
        { count: 6, dataCodewords: 23 }
      ]
    }, // V26
    {
      totalCodewords: 1828,
      groups: [
        { count: 8, dataCodewords: 23 },
        { count: 26, dataCodewords: 24 }
      ]
    }, // V27
    {
      totalCodewords: 1921,
      groups: [
        { count: 4, dataCodewords: 24 },
        { count: 31, dataCodewords: 25 }
      ]
    }, // V28
    {
      totalCodewords: 2051,
      groups: [
        { count: 1, dataCodewords: 23 },
        { count: 37, dataCodewords: 24 }
      ]
    }, // V29
    {
      totalCodewords: 2185,
      groups: [
        { count: 15, dataCodewords: 24 },
        { count: 25, dataCodewords: 25 }
      ]
    }, // V30
    {
      totalCodewords: 2323,
      groups: [
        { count: 42, dataCodewords: 24 },
        { count: 1, dataCodewords: 25 }
      ]
    }, // V31
    {
      totalCodewords: 2465,
      groups: [
        { count: 10, dataCodewords: 24 },
        { count: 35, dataCodewords: 25 }
      ]
    }, // V32
    {
      totalCodewords: 2611,
      groups: [
        { count: 29, dataCodewords: 24 },
        { count: 19, dataCodewords: 25 }
      ]
    }, // V33
    {
      totalCodewords: 2761,
      groups: [
        { count: 44, dataCodewords: 24 },
        { count: 7, dataCodewords: 25 }
      ]
    }, // V34
    {
      totalCodewords: 2876,
      groups: [
        { count: 39, dataCodewords: 24 },
        { count: 14, dataCodewords: 25 }
      ]
    }, // V35
    {
      totalCodewords: 3034,
      groups: [
        { count: 46, dataCodewords: 24 },
        { count: 10, dataCodewords: 25 }
      ]
    }, // V36
    {
      totalCodewords: 3196,
      groups: [
        { count: 49, dataCodewords: 24 },
        { count: 10, dataCodewords: 25 }
      ]
    }, // V37
    {
      totalCodewords: 3362,
      groups: [
        { count: 48, dataCodewords: 24 },
        { count: 14, dataCodewords: 25 }
      ]
    }, // V38
    {
      totalCodewords: 3532,
      groups: [
        { count: 43, dataCodewords: 24 },
        { count: 22, dataCodewords: 25 }
      ]
    }, // V39
    {
      totalCodewords: 3706,
      groups: [
        { count: 34, dataCodewords: 24 },
        { count: 34, dataCodewords: 25 }
      ]
    } // V40
  ],

  // ---- ECC-H (indicator 0b10) ----
  H: [
    { totalCodewords: 0, groups: [] }, // V0 placeholder
    { totalCodewords: 26, groups: [{ count: 1, dataCodewords: 9 }] }, // V1
    { totalCodewords: 44, groups: [{ count: 1, dataCodewords: 16 }] }, // V2
    { totalCodewords: 70, groups: [{ count: 2, dataCodewords: 13 }] }, // V3
    { totalCodewords: 100, groups: [{ count: 4, dataCodewords: 9 }] }, // V4
    {
      totalCodewords: 134,
      groups: [
        { count: 2, dataCodewords: 11 },
        { count: 2, dataCodewords: 12 }
      ]
    }, // V5
    { totalCodewords: 172, groups: [{ count: 4, dataCodewords: 15 }] }, // V6
    {
      totalCodewords: 196,
      groups: [
        { count: 4, dataCodewords: 13 },
        { count: 1, dataCodewords: 14 }
      ]
    }, // V7
    {
      totalCodewords: 242,
      groups: [
        { count: 4, dataCodewords: 14 },
        { count: 2, dataCodewords: 15 }
      ]
    }, // V8
    {
      totalCodewords: 292,
      groups: [
        { count: 4, dataCodewords: 12 },
        { count: 4, dataCodewords: 13 }
      ]
    }, // V9
    {
      totalCodewords: 346,
      groups: [
        { count: 6, dataCodewords: 15 },
        { count: 2, dataCodewords: 16 }
      ]
    }, // V10
    {
      totalCodewords: 404,
      groups: [
        { count: 3, dataCodewords: 12 },
        { count: 8, dataCodewords: 13 }
      ]
    }, // V11
    {
      totalCodewords: 466,
      groups: [
        { count: 7, dataCodewords: 14 },
        { count: 4, dataCodewords: 15 }
      ]
    }, // V12
    {
      totalCodewords: 532,
      groups: [
        { count: 12, dataCodewords: 11 },
        { count: 4, dataCodewords: 12 }
      ]
    }, // V13
    {
      totalCodewords: 581,
      groups: [
        { count: 11, dataCodewords: 12 },
        { count: 5, dataCodewords: 13 }
      ]
    }, // V14
    {
      totalCodewords: 655,
      groups: [
        { count: 11, dataCodewords: 12 },
        { count: 7, dataCodewords: 13 }
      ]
    }, // V15
    {
      totalCodewords: 733,
      groups: [
        { count: 3, dataCodewords: 15 },
        { count: 13, dataCodewords: 16 }
      ]
    }, // V16
    {
      totalCodewords: 815,
      groups: [
        { count: 2, dataCodewords: 14 },
        { count: 17, dataCodewords: 15 }
      ]
    }, // V17
    {
      totalCodewords: 901,
      groups: [
        { count: 2, dataCodewords: 14 },
        { count: 19, dataCodewords: 15 }
      ]
    }, // V18
    {
      totalCodewords: 991,
      groups: [
        { count: 9, dataCodewords: 13 },
        { count: 16, dataCodewords: 14 }
      ]
    }, // V19
    {
      totalCodewords: 1085,
      groups: [
        { count: 15, dataCodewords: 15 },
        { count: 10, dataCodewords: 16 }
      ]
    }, // V20
    {
      totalCodewords: 1156,
      groups: [
        { count: 19, dataCodewords: 16 },
        { count: 6, dataCodewords: 17 }
      ]
    }, // V21
    { totalCodewords: 1258, groups: [{ count: 34, dataCodewords: 13 }] }, // V22
    {
      totalCodewords: 1364,
      groups: [
        { count: 16, dataCodewords: 15 },
        { count: 14, dataCodewords: 16 }
      ]
    }, // V23
    {
      totalCodewords: 1474,
      groups: [
        { count: 30, dataCodewords: 16 },
        { count: 2, dataCodewords: 17 }
      ]
    }, // V24
    {
      totalCodewords: 1588,
      groups: [
        { count: 22, dataCodewords: 15 },
        { count: 13, dataCodewords: 16 }
      ]
    }, // V25
    {
      totalCodewords: 1706,
      groups: [
        { count: 33, dataCodewords: 16 },
        { count: 4, dataCodewords: 17 }
      ]
    }, // V26
    {
      totalCodewords: 1828,
      groups: [
        { count: 12, dataCodewords: 15 },
        { count: 28, dataCodewords: 16 }
      ]
    }, // V27
    {
      totalCodewords: 1921,
      groups: [
        { count: 11, dataCodewords: 15 },
        { count: 31, dataCodewords: 16 }
      ]
    }, // V28
    {
      totalCodewords: 2051,
      groups: [
        { count: 19, dataCodewords: 15 },
        { count: 26, dataCodewords: 16 }
      ]
    }, // V29
    {
      totalCodewords: 2185,
      groups: [
        { count: 23, dataCodewords: 15 },
        { count: 25, dataCodewords: 16 }
      ]
    }, // V30
    {
      totalCodewords: 2323,
      groups: [
        { count: 23, dataCodewords: 15 },
        { count: 28, dataCodewords: 16 }
      ]
    }, // V31
    {
      totalCodewords: 2465,
      groups: [
        { count: 19, dataCodewords: 15 },
        { count: 35, dataCodewords: 16 }
      ]
    }, // V32
    {
      totalCodewords: 2611,
      groups: [
        { count: 11, dataCodewords: 15 },
        { count: 46, dataCodewords: 16 }
      ]
    }, // V33
    {
      totalCodewords: 2761,
      groups: [
        { count: 59, dataCodewords: 16 },
        { count: 1, dataCodewords: 17 }
      ]
    }, // V34
    {
      totalCodewords: 2876,
      groups: [
        { count: 22, dataCodewords: 15 },
        { count: 41, dataCodewords: 16 }
      ]
    }, // V35
    {
      totalCodewords: 3034,
      groups: [
        { count: 2, dataCodewords: 15 },
        { count: 64, dataCodewords: 16 }
      ]
    }, // V36
    {
      totalCodewords: 3196,
      groups: [
        { count: 24, dataCodewords: 15 },
        { count: 46, dataCodewords: 16 }
      ]
    }, // V37
    {
      totalCodewords: 3362,
      groups: [
        { count: 42, dataCodewords: 15 },
        { count: 32, dataCodewords: 16 }
      ]
    }, // V38
    {
      totalCodewords: 3532,
      groups: [
        { count: 10, dataCodewords: 15 },
        { count: 67, dataCodewords: 16 }
      ]
    }, // V39
    {
      totalCodewords: 3706,
      groups: [
        { count: 20, dataCodewords: 15 },
        { count: 61, dataCodewords: 16 }
      ]
    } // V40
  ]
}

/**
 * 计算指定 ECC 等级和版本下 Byte 模式最多可编码的用户字节数。
 * 公式: floor((totalDataCW * 8 - 4 - charCountBits) / 8)
 */
export function getMaxPayloadBytes(ec: ErrorCorrectionLevel, version: number): number {
  const table = VERSION_EC_TABLES[ec]
  if (!table || !table[version]) return 0
  const info = table[version]
  const totalDataCW = info.groups.reduce((sum, g) => sum + g.count * g.dataCodewords, 0)
  const charCountBits = version <= 9 ? 8 : 16
  return Math.floor((totalDataCW * 8 - 4 - charCountBits) / 8)
}

// 对齐图案中心坐标 (V1 无对齐图案)
export const ALIGNMENT_POSITIONS: number[][] = [
  [], // V1
  [6, 18], // V2
  [6, 22], // V3
  [6, 26], // V4
  [6, 30], // V5
  [6, 34], // V6
  [6, 22, 38], // V7
  [6, 24, 42], // V8
  [6, 26, 46], // V9
  [6, 28, 50], // V10
  [6, 30, 54], // V11
  [6, 32, 58], // V12
  [6, 34, 62], // V13
  [6, 26, 46, 66], // V14
  [6, 26, 48, 70], // V15
  [6, 26, 50, 74], // V16
  [6, 30, 54, 78], // V17
  [6, 30, 56, 82], // V18
  [6, 30, 58, 86], // V19
  [6, 34, 62, 90], // V20
  [6, 28, 50, 72, 94], // V21
  [6, 26, 50, 74, 98], // V22
  [6, 30, 54, 78, 102], // V23
  [6, 28, 54, 80, 106], // V24
  [6, 32, 58, 84, 110], // V25
  [6, 30, 58, 86, 114], // V26
  [6, 34, 62, 90, 118], // V27
  [6, 26, 50, 74, 98, 122], // V28
  [6, 30, 54, 78, 102, 126], // V29
  [6, 26, 52, 78, 104, 130], // V30
  [6, 30, 56, 82, 108, 134], // V31
  [6, 34, 60, 86, 112, 138], // V32
  [6, 30, 58, 86, 114, 142], // V33
  [6, 34, 62, 90, 118, 146], // V34
  [6, 30, 54, 78, 102, 126, 150], // V35
  [6, 24, 50, 76, 102, 128, 154], // V36
  [6, 28, 54, 80, 106, 132, 158], // V37
  [6, 32, 58, 84, 110, 136, 162], // V38
  [6, 26, 54, 82, 110, 138, 166], // V39
  [6, 30, 58, 86, 114, 142, 170] // V40
]
