# Quick Test Reference Card

## 🚀 Run Tests Now

```bash
npm test
```

Expected: **All 60+ tests pass** ✅

---

## 📋 Quick Manual Test (Copy & Paste)

Open the app in browser and try these inputs:

### ✅ Standard Cases
```
192.168.1.0/24    → Network: 192.168.1.0, Broadcast: 192.168.1.255, Usable: 254
10.0.0.0/16       → Network: 10.0.0.0, Broadcast: 10.0.255.255, Usable: 65534
172.16.0.0/22     → Network: 172.16.0.0, Broadcast: 172.16.3.255, Usable: 1022
```

### ⚠️ Edge Cases
```
8.8.8.8/32        → Single host, Usable: 0
10.0.0.0/31       → Point-to-point, Usable: 0
0.0.0.0/0         → Entire internet, 4+ billion hosts
```

### ❌ Invalid Cases (Should Show Error)
```
256.1.1.1/24      → Invalid (octet > 255)
192.168.1.1       → Invalid (missing prefix)
192.168.001.1/24  → Invalid (leading zeros)
```

### 🎨 Visual Subnetter Test
```
1. Enter: 192.168.1.0/24
2. Change "New prefix" to 26
3. Should show: 4 subnets (192.168.1.0/26, .64/26, .128/26, .192/26)
```

---

## 🎯 All Prefix Verification

Test random prefixes - all should work:

| Prefix | Test CIDR | Expected Mask | Expected Hosts |
|--------|-----------|---------------|----------------|
| /8 | `10.0.0.0/8` | 255.0.0.0 | 16,777,216 |
| /16 | `172.16.0.0/16` | 255.255.0.0 | 65,536 |
| /20 | `10.0.0.0/20` | 255.255.240.0 | 4,096 |
| /24 | `192.168.1.0/24` | 255.255.255.0 | 256 |
| /25 | `192.168.1.0/25` | 255.255.255.128 | 128 |
| /28 | `192.168.1.0/28` | 255.255.255.240 | 16 |
| /30 | `192.168.1.0/30` | 255.255.255.252 | 4 |

---

## ✅ Success Criteria

- [ ] All automated tests pass (`npm test`)
- [ ] Standard cases calculate correctly
- [ ] Edge cases (0, 31, 32) work without errors
- [ ] Invalid inputs show error messages
- [ ] Visual subnetter splits networks correctly
- [ ] Copy buttons work
- [ ] UI is responsive on mobile

---

## 🐛 If Tests Fail

1. Check you ran `npm install` first
2. Make sure all files were copied correctly
3. Try `npm install` again to ensure test dependencies installed
4. Check Node version: `node --version` (should be 16+)
5. See detailed logs in `npm test -- --reporter=verbose`

---

## 📊 Test Coverage Command

```bash
npm run test:coverage
```

Should show:
- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

---

## 🎓 What's Being Tested

✅ **All 33 prefix lengths** (/0 through /32)  
✅ **IP validation** (valid + invalid formats)  
✅ **Network calculations** (network, broadcast, mask, wildcard)  
✅ **Host calculations** (total, usable, first, last)  
✅ **Subnetting** (splitting networks into smaller subnets)  
✅ **Edge cases** (single host, point-to-point, entire internet)  
✅ **Network classes** (A, B, C, D, E)  
✅ **Real-world scenarios** (AWS VPC, office networks, etc.)

---

**Result**: 100% confidence in subnet calculations for all scenarios! 🎉
