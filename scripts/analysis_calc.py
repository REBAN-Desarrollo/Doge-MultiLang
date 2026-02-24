
# ============================================================
# QPH REVENUE ANALYSIS - COMPLETE CALCULATIONS
# ============================================================

total_rev = 330895.852
total_views = 353632104
es_avd_sec = 281  # 4:41

# Revenue by language (Block 4)
rev_by_lang = {
    'ES':  {'rev': 184200, 'views': 232170000, 'rpm': 0.79, 'mult': 1.0},
    'EN':  {'rev': 76200,  'views': 40756000,  'rpm': 1.87, 'mult': 2.4},
    'PT':  {'rev': 19260,  'views': 35530000,  'rpm': 0.54, 'mult': 0.7},
    'DE':  {'rev': 12250,  'views': 2152000,   'rpm': 5.69, 'mult': 7.2},
    'IT':  {'rev': 9890,   'views': 4383000,   'rpm': 2.26, 'mult': 2.9},
    'FR':  {'rev': 7010,   'views': 4934000,   'rpm': 1.42, 'mult': 1.8},
    'RU':  {'rev': 2220,   'views': 18968000,  'rpm': 0.12, 'mult': 0.15},
    'TR':  {'rev': 2330,   'views': 5407000,   'rpm': 0.43, 'mult': 0.5},
    'JA':  {'rev': 1150,   'views': 692000,    'rpm': 1.66, 'mult': 2.1},
    'AR':  {'rev': 740,    'views': 3010000,   'rpm': 0.25, 'mult': 0.3},
    'KO':  {'rev': 580,    'views': 629000,    'rpm': 0.92, 'mult': 1.2},
    'ID':  {'rev': 860,    'views': 3621000,   'rpm': 0.24, 'mult': 0.3},
    'HI':  {'rev': 280,    'views': 840000,    'rpm': 0.33, 'mult': 0.4},
    'FIL': {'rev': 760,    'views': 46000,     'rpm': 16.52, 'mult': None},
    'MS':  {'rev': 37,     'views': 73000,     'rpm': 0.51, 'mult': 0.6},
    'TA':  {'rev': 46,     'views': 30000,     'rpm': 1.53, 'mult': None},
    'ZH':  {'rev': 0,      'views': 65000,     'rpm': 0.00, 'mult': 0.0},
}

lang_avd = {
    'ES': 281, 'EN': 184, 'PT': 229, 'DE': 220,
    'IT': 214, 'FR': 218, 'RU': 223, 'TR': 213,
    'JA': 142, 'AR': 203, 'KO': 147, 'ID': 186,
    'HI': 176, 'FIL': 144, 'MS': 146, 'TA': 118, 'ZH': 144
}

total_est = sum(v['rev'] for v in rev_by_lang.values())

# ============================================================
print("=" * 80)
print("SECTION 1: REVENUE BY LANGUAGE GROUP")
print("=" * 80)
print()
print(f"{'Lang':<6} {'Rev%':>8} {'Views%':>9} {'RPM$':>7} {'MultES':>8} {'AVD':>7} {'AVD_delta':>10} {'Rev_rank':>9}")
print("-" * 72)

ranked = sorted(rev_by_lang.items(), key=lambda x: -x[1]['rev'])
for i, (lang, d) in enumerate(ranked, 1):
    pct_rev = d['rev'] / total_est * 100
    pct_views = d['views'] / total_views * 100
    avd_s = lang_avd.get(lang, 0)
    avd_str = f"{avd_s//60}:{avd_s%60:02d}" if avd_s else "N/A"
    delta_pct = (avd_s - es_avd_sec) / es_avd_sec * 100 if avd_s else 0
    delta_str = f"{delta_pct:+.0f}%"
    mult_str = f"x{d['mult']}" if d['mult'] is not None else "N/A"
    print(f"{lang:<6} {pct_rev:>7.1f}% {pct_views:>8.1f}% {d['rpm']:>7.2f} {mult_str:>8} {avd_str:>7} {delta_str:>10} #{i:>6}")

print()
top3_rev = 184200 + 76200 + 19260
bottom_all = total_est - top3_rev
print(f"ES share:              {184200/total_est*100:.1f}%")
print(f"ES+EN share:           {(184200+76200)/total_est*100:.1f}%")
print(f"ES+EN+PT share:        {top3_rev/total_est*100:.1f}%")
print(f"Top 3 vs rest (14):    {top3_rev/bottom_all:.1f}x")
print(f"Bottom 6 (TA,ZH,MS,HI,KO,FIL): {(46+0+37+280+580+760)/total_est*100:.1f}%")

# ============================================================
print()
print("=" * 80)
print("SECTION 2: US SPLIT ANALYSIS (ES vs EN)")
print("=" * 80)
print()

us_rev = 123633.14
us_views = 23118154
es_total_audio = 142205540 + 89964695 + 2799
latam_es_views = (81036962 + 23710314 + 24977123 + 10387569 + 13455412 +
                  14334253 + 10899565 + 4557681 + 4839184 + 12675244 +
                  1333800 + 1558241 + 2876535 + 2397896 + 4175345 +
                  1170900 + 1946152)
es_in_us_est = es_total_audio - latam_es_views

print(f"ES audio track total:        {es_total_audio:>15,} views")
print(f"LATAM ES countries total:    {latam_es_views:>15,} views")
print(f"Residual (US Hispanics est): {es_in_us_est:>15,} views")
print(f"US total views:              {us_views:>15,} views")
print(f"Implied ES% of US views:     {es_in_us_est/us_views*100:>15.1f}%")
print()

scenarios = [
    ("Conservative", 0.35),
    ("Base case",    0.52),
    ("Aggressive",   0.65),
]
print(f"{'Scenario':<16} {'ES%US':>8} {'ES_from_US':>14} {'EN_from_US':>14} {'Total_ES%':>12} {'EN/ES_mult':>12}")
print("-" * 78)
for label, pct in scenarios:
    es_us = us_rev * pct
    en_us = us_rev * (1 - pct)
    # Adjust total ES: base has 64249 from US, replace with scenario value
    total_es_scenario = 184200 - 64249 + es_us
    total_en_scenario = 76200 - 59384 + en_us
    en_es_mult = (total_en_scenario / total_es_scenario) * (184200 / 76200)
    print(f"{label:<16} {pct*100:>7.0f}% {es_us:>13,.0f}$ {en_us:>13,.0f}$ {total_es_scenario/total_est*100:>11.1f}% {'varies':>12}")

# ============================================================
print()
print("=" * 80)
print("SECTION 3: AVD DELTA BY CLUSTER")
print("=" * 80)
print()

clusters = [
    ("Original ES",        281, 232170000, 184200),
    ("PT-BR",              229,  35530000,  19260),
    ("European (DE+FR+IT)",217,  11469000,  29150),
    ("RU+TR",              218,  24375000,   4550),
    ("EN Master",          184,  40756000,  76200),
    ("Arabic (AR)",        203,   3010000,    740),
    ("South Asian (HI)",   176,    840000,    280),
    ("CJK (JA+KO+ZH)",    144,   1386000,   1730),
    ("SEA (ID+FIL+MS)",   159,   3740000,   1657),
    ("Tamil (TA)",         118,     30000,     46),
]

print(f"{'Cluster':<26} {'AVD':>7} {'Delta%':>8} {'%ofES':>7} {'Views':>13} {'Rev%':>7}")
print("-" * 78)
for name, avd, views, rev in clusters:
    delta = (avd - es_avd_sec) / es_avd_sec * 100
    pct_of_es = avd / es_avd_sec * 100
    rev_pct = rev / total_est * 100
    avd_str = f"{avd//60}:{avd%60:02d}"
    print(f"{name:<26} {avd_str:>7} {delta:>+7.0f}% {pct_of_es:>6.0f}% {views:>13,} {rev_pct:>6.1f}%")

print()
print("REVENUE OPPORTUNITY if AVD improved to ES level (4:41):")
print("Methodology: Revenue scales ~proportionally with watch time (AVD x Views constant)")
print()
print(f"{'Cluster':<22} {'CurrAVD':>8} {'Lift_needed':>13} {'Watch_time_gain':>17} {'Rev_uplift':>12}")
print("-" * 76)
opp_data = [
    ("EN Master",          184,  40756000,  76200),
    ("DE+FR (Tier1 Eur)",  219,   7086000,  19260),
    ("IT (Tier2 Eur)",     214,   4383000,   9890),
    ("CJK (JA+KO+ZH)",    144,   1386000,   1730),
    ("PT-BR",              229,  35530000,  19260),
]
for name, avd, views, rev in opp_data:
    lift_pct = (es_avd_sec - avd) / avd * 100
    wt_gain_pct = lift_pct  # watch time gain = AVD lift %
    rev_uplift_pct = lift_pct  # revenue approx proportional
    avd_str = f"{avd//60}:{avd%60:02d}"
    print(f"{name:<22} {avd_str:>8} {lift_pct:>+12.0f}% {wt_gain_pct:>+16.0f}% {rev_uplift_pct:>+11.0f}%")

# ============================================================
print()
print("=" * 80)
print("SECTION 4: VP TIER ANALYSIS")
print("=" * 80)
print()

# Geo data for VP calc
geo = {
    'US': {'rev': 123633.14, 'views': 23118154},
    'MX': {'rev': 66410.39,  'views': 81036962},
    'BR': {'rev': 18615.51,  'views': 36801945},
    'DE': {'rev': 12853.36,  'views': 3144834},
    'IT': {'rev': 10631.41,  'views': 4925125},
    'PE': {'rev': 9999.18,   'views': 23710314},
    'CL': {'rev': 7882.67,   'views': 10387569},
    'AR': {'rev': 7604.56,   'views': 24977123},
    'ES': {'rev': 7282.15,   'views': 3745690},
    'FR': {'rev': 6852.73,   'views': 2528246},
    'GB': {'rev': 5935.27,   'views': 1805425},
    'CA': {'rev': 5920.62,   'views': 1705951},
    'CO': {'rev': 5535.49,   'views': 13455412},
    'EC': {'rev': 4005.25,   'views': 14334253},
    'AU': {'rev': 2650.24,   'views': 567727},
    'PH': {'rev': 2530.71,   'views': 5887262},
    'TR': {'rev': 2455.10,   'views': 5024118},
    'GT': {'rev': 2114.76,   'views': 4557681},
    'UA': {'rev': 1620.16,   'views': 2859882},
    'JP': {'rev': 1280.19,   'views': 830227},
    'NL': {'rev': 1185.38,   'views': 603687},
    'DO': {'rev': 1168.68,   'views': 4839184},
    'BO': {'rev': 984.99,    'views': 12675244},
    'KZ': {'rev': 949.79,    'views': 3046003},
    'CR': {'rev': 899.64,    'views': 1333800},
    'PT': {'rev': 871.04,    'views': 725442},
    'PA': {'rev': 822.45,    'views': 1558241},
    'HN': {'rev': 770.72,    'views': 2876535},
    'AT': {'rev': 759.04,    'views': 234634},
    'SV': {'rev': 757.13,    'views': 2397896},
    'ID': {'rev': 747.78,    'views': 4655012},
    'PR': {'rev': 711.36,    'views': 517305},
    'PY': {'rev': 642.15,    'views': 4175345},
    'KR': {'rev': 610.72,    'views': 683315},
    'IN': {'rev': 464.55,    'views': 1818059},
    'VE': {'rev': 419.34,    'views': 10899565},
    'RU': {'rev': 6.45,      'views': 5847342},
}

tier_weights = {1: 3.0, 2: 1.8, 3: 1.0, 4: 0.7, 5: 0.3}
country_tiers = {
    'US': 1, 'CA': 1, 'GB': 1, 'AU': 1, 'DE': 1, 'FR': 1, 'NL': 1, 'AT': 1,
    'ES': 2, 'IT': 2, 'JP': 2, 'KR': 2, 'BR': 2, 'PT': 2,
    'MX': 3, 'AR': 3, 'CO': 3, 'CL': 3, 'PE': 3, 'EC': 3, 'VE': 3,
    'GT': 4, 'DO': 4, 'BO': 4, 'CR': 4, 'PA': 4, 'HN': 4, 'SV': 4,
    'PR': 4, 'PY': 4, 'NI': 4, 'UY': 4,
    'PH': 5, 'TR': 5, 'UA': 5, 'ID': 5, 'IN': 5, 'KZ': 5, 'RU': 5,
}

tier_agg = {t: {'views': 0, 'rev': 0, 'vp': 0} for t in range(1, 6)}
for c, d in geo.items():
    t = country_tiers.get(c, 4)
    w = tier_weights[t]
    tier_agg[t]['views'] += d['views']
    tier_agg[t]['rev'] += d['rev']
    tier_agg[t]['vp'] += d['views'] * w

total_vp = sum(t['vp'] for t in tier_agg.values())
total_geo_rev = sum(d['rev'] for d in geo.values())
total_geo_views = sum(d['views'] for d in geo.values())

print(f"{'Tier':<6} {'Weight':>7} {'Views':>15} {'Views%':>8} {'VP':>15} {'VP%':>8} {'Rev':>12} {'Rev%':>8} {'RPM_eff':>9}")
print("-" * 93)
for t in range(1, 6):
    d = tier_agg[t]
    w = tier_weights[t]
    views_pct = d['views'] / total_geo_views * 100
    vp_pct = d['vp'] / total_vp * 100
    rev_pct = d['rev'] / total_geo_rev * 100
    rpm_eff = (d['rev'] / d['views'] * 1000) if d['views'] > 0 else 0
    print(f"T{t:<5} x{w:<6.1f} {d['views']:>15,} {views_pct:>7.1f}% {d['vp']:>15,.0f} {vp_pct:>7.1f}% {d['rev']:>11,.0f}$ {rev_pct:>7.1f}% {rpm_eff:>8.2f}$")

print()
t1 = tier_agg[1]
t2 = tier_agg[2]
t12_views = t1['views'] + t2['views']
t12_vp = t1['vp'] + t2['vp']
t12_rev = t1['rev'] + t2['rev']
print(f"Tier 1+2 combined:")
print(f"  Views: {t12_views:,} = {t12_views/total_geo_views*100:.1f}% of total")
print(f"  VP:    {t12_vp:,.0f} = {t12_vp/total_vp*100:.1f}% of total VP")
print(f"  Rev:   {t12_rev:,.0f}$ = {t12_rev/total_geo_rev*100:.1f}% of geo revenue")
print()
print("KPI CONTEXT: % VP from T1+2 > 25% target")
print(f"  Current T1+2 VP share: {t12_vp/total_vp*100:.1f}% (target: >25%)")
print()

# VP by language (estimated)
print("VP WEIGHT BY LANGUAGE (estimated geographic distribution):")
print()
lang_tier_dist = {
    'ES':  {1: 0.15, 2: 0.05, 3: 0.68, 4: 0.10, 5: 0.02},
    'EN':  {1: 0.65, 2: 0.08, 3: 0.02, 4: 0.05, 5: 0.20},
    'PT':  {1: 0.00, 2: 0.98, 3: 0.00, 4: 0.01, 5: 0.01},
    'DE':  {1: 0.95, 2: 0.03, 3: 0.01, 4: 0.01, 5: 0.00},
    'FR':  {1: 0.88, 2: 0.03, 3: 0.00, 4: 0.00, 5: 0.09},
    'IT':  {1: 0.00, 2: 0.95, 3: 0.02, 4: 0.02, 5: 0.01},
    'RU':  {1: 0.00, 2: 0.00, 3: 0.00, 4: 0.05, 5: 0.95},
    'JA':  {1: 0.00, 2: 0.95, 3: 0.00, 4: 0.00, 5: 0.05},
    'KO':  {1: 0.00, 2: 0.95, 3: 0.00, 4: 0.00, 5: 0.05},
}

es_views_l = 232170000
es_vp_per_view = sum(tier_weights[t] * lang_tier_dist['ES'][t] for t in range(1,6))

print(f"{'Lang':<6} {'Views':>13} {'VP_per_view':>13} {'VP_index_ES=1':>16} {'Total_VP':>15}")
print("-" * 68)
for lang, dist in lang_tier_dist.items():
    views = rev_by_lang[lang]['views']
    vpv = sum(tier_weights[t] * dist[t] for t in range(1,6))
    idx = vpv / es_vp_per_view
    total_vp_lang = views * vpv
    print(f"{lang:<6} {views:>13,} {vpv:>13.3f} {idx:>15.2f}x {total_vp_lang:>15,.0f}")

# ============================================================
print()
print("=" * 80)
print("SECTION 5: GROWTH POTENTIAL MATRIX")
print("=" * 80)
print()

print(f"{'Lang':<6} {'RPM$':>7} {'RPM_cat':>10} {'Views':>13} {'Vol_cat':>9} {'AVD_pct':>9} {'AVD_hlth':>10} {'Priority':>12} {'Action'}")
print("-" * 100)

actions = {
    'ES':  ('CORE',     'Protect — baseline, maintain quality'),
    'EN':  ('CRITICAL', 'Fix AVD first — master affects all downstream'),
    'PT':  ('SCALE',    'Grow Brazil — second biggest by views'),
    'DE':  ('PREMIUM',  'Grow volume — x7.2 RPM every view counts'),
    'IT':  ('PREMIUM',  'Grow volume — strong RPM, fix AVD'),
    'FR':  ('PREMIUM',  'Grow volume — Africa bonus market'),
    'RU':  ('HOLD',     'VPN distorts — wait for revenue clarity'),
    'TR':  ('MONITOR',  'Break-even — low priority'),
    'JA':  ('INVEST',   'Fix AVD or pause — RPM premium wasted'),
    'AR':  ('EVALUATE', 'Low RPM — cultural localization needed'),
    'KO':  ('PAUSE?',   'AVD -48%, 629K views, $580 revenue'),
    'ID':  ('MONITOR',  'High views, very low RPM — monitor cost'),
    'HI':  ('FUTURE',   'India is long-term bet, not today'),
    'FIL': ('PAUSE',    'Negative ROI — cost > revenue'),
    'MS':  ('PAUSE?',   'Marginal — $37 revenue'),
    'TA':  ('PAUSE',    'Negative ROI — AVD 1:58, $46 revenue'),
    'ZH':  ('PAUSE',    'Zero revenue — $0 attributed'),
}

for lang in ['ES','EN','PT','DE','IT','FR','RU','TR','JA','AR','KO','ID','HI','FIL','MS','TA','ZH']:
    d = rev_by_lang[lang]
    avd_s = lang_avd.get(lang, 0)
    avd_pct = f"{avd_s/es_avd_sec*100:.0f}%" if avd_s else "N/A"
    rpm = d['rpm']
    rpm_cat = "PREMIUM" if rpm >= 2.0 else ("MID" if rpm >= 0.8 else "LOW")
    vol_cat = "HIGH(10M+)" if d['views'] >= 10e6 else ("MID(1M+)" if d['views'] >= 1e6 else "LOW(<1M)")
    avd_hlth = "GOOD" if avd_s >= 210 else ("WARN" if avd_s >= 170 else "POOR")
    priority, action = actions[lang]
    print(f"{lang:<6} {rpm:>7.2f} {rpm_cat:>10} {d['views']:>13,} {vol_cat:>9} {avd_pct:>9} {avd_hlth:>10} {priority:>12}  {action}")

# ============================================================
print()
print("=" * 80)
print("SECTION 6: KEY RATIOS SUMMARY")
print("=" * 80)
print()

print("REVENUE CONCENTRATION:")
print(f"  ES alone:                     {184200/total_est*100:>6.1f}% of estimated total")
print(f"  ES + EN:                      {(184200+76200)/total_est*100:>6.1f}%")
print(f"  ES + EN + PT (top 3):         {top3_rev/total_est*100:>6.1f}%")
print(f"  Top 3 vs remaining 14 langs:  {top3_rev/bottom_all:>6.1f}x")
print(f"  Top 6 (add DE,IT,FR):         {(top3_rev+12250+9890+7010)/total_est*100:>6.1f}%")
print(f"  Bottom 4 (TA,ZH,MS,FIL):     {(46+0+37+760)/total_est*100:>6.2f}%")
print()

# HHI
shares = [v['rev']/total_est for v in rev_by_lang.values() if v['rev'] > 0]
hhi = sum(s**2 for s in shares) * 10000
print(f"  Herfindahl-Hirschman Index:   {hhi:>6.0f} / 10000")
print(f"  (>2500 = highly concentrated, ES dominates)")
print()

print("RPM SPREAD:")
rpms = [(lang, d['rpm']) for lang, d in rev_by_lang.items() if d['rpm'] > 0 and lang != 'FIL']
max_rpm_lang, max_rpm = max(rpms, key=lambda x: x[1])
min_rpm_lang, min_rpm = min(rpms, key=lambda x: x[1])
print(f"  Highest RPM: {max_rpm_lang} at ${max_rpm:.2f}/1K views")
print(f"  Lowest RPM:  {min_rpm_lang} at ${min_rpm:.2f}/1K views")
print(f"  DE/RU spread: {max_rpm/min_rpm:.0f}x (DE earns {max_rpm/min_rpm:.0f}x more per view than RU)")
print(f"  DE/ES spread: {5.69/0.79:.1f}x (DE earns 7.2x more per view than ES)")
print()

print("VIEWS VS REVENUE DISCONNECT:")
print(f"  ES: {232170000/total_views*100:.0f}% of views, {184200/total_est*100:.0f}% of revenue (close match)")
print(f"  RU: {18968000/total_views*100:.0f}% of views, {2220/total_est*100:.1f}% of revenue (VPN distortion)")
print(f"  DE: {2152000/total_views*100:.1f}% of views, {12250/total_est*100:.1f}% of revenue (premium CPM)")
print(f"  PT: {35530000/total_views*100:.0f}% of views, {19260/total_est*100:.1f}% of revenue (BR T3 market)")
print()

print("QUALITY-ADJUSTED RPM (RPM x AVD_index, ES=1.0x):")
print(f"{'Lang':<6} {'RPM':>8} {'AVD_idx':>9} {'QA_RPM':>10} {'QA_idx':>10}")
print("-" * 46)
for lang in ['ES','EN','DE','FR','IT','PT','JA','KO','RU','TR','AR','ID','HI','TA']:
    if lang in rev_by_lang:
        avd_s = lang_avd.get(lang, es_avd_sec)
        avd_idx = avd_s / es_avd_sec
        rpm = rev_by_lang[lang]['rpm']
        qa_rpm = rpm * avd_idx
        es_qa = 0.79 * 1.0
        qa_idx = qa_rpm / es_qa
        avd_str = f"{avd_s//60}:{avd_s%60:02d}"
        print(f"{lang:<6} {rpm:>8.2f} {avd_idx:>8.2f}x {qa_rpm:>10.2f} {qa_idx:>9.2f}x")

print()
print("=" * 80)
print("FINAL SUMMARY FOR SLIDES")
print("=" * 80)
print()
print("FINANCIAL SNAPSHOT (2025 full year):")
print(f"  Total channel revenue:       $330,896 USD")
print(f"  Total views:                 353.6M")
print(f"  Total audio languages:       22 tracks")
print(f"  Countries with revenue:      148+")
print()
print("TOP LINE RATIOS:")
print(f"  ES dominance:                56% of revenue from Spanish-language viewers")
print(f"  US Hispanics hidden in EN:   ~$64K classified as US but consuming ES content")
print(f"  DE RPM multiplier:           x7.2 vs ES baseline (highest of all languages)")
print(f"  EN RPM multiplier:           x2.4 vs ES")
print(f"  RU paradox:                  5.4% of views, 0.7% of revenue (VPN theory)")
print()
print("CRITICAL ALERTS:")
print(f"  EN AVD deficit:              -35% vs ES (affects ALL 26 downstream languages)")
print(f"  CJK cluster AVD:             -49% vs ES (50% watch time lost)")
print(f"  Tamil ROI:                   NEGATIVE ($46 revenue vs ~$200-300 dubbing cost)")
print(f"  Filipino ROI:                NEAR-ZERO ($50-760 attribution noise)")
print()
print("OPPORTUNITY SIZE:")
print(f"  If EN AVD improves to ES level:  +53% watch time -> proportional revenue lift")
print(f"  If DE volume grows 20%:          +$2.4K additional (at x7.2 RPM multiplier)")
print(f"  If CJK AVD improves to EU level: +95% watch time in CJK cluster")
