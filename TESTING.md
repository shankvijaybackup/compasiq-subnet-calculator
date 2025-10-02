# Subnet Calculator Testing Guide

## Automated Tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Watch mode (auto-rerun on file changes)
npm test -- --watch
```

### Test Coverage

Our test suite covers:
- ✅ IPv4 validation (valid/invalid formats)
- ✅ IP to integer conversions (bidirectional)
- ✅ Prefix to mask conversions
- ✅ Mask to prefix conversions
- ✅ Wildcard mask calculations
- ✅ Network classification (Class A/B/C/D/E)
- ✅ Prefix clamping and validation
- ✅ Standard subnet calculations (/8, /16, /24, /30)
- ✅ Edge cases (/0, /1, /31, /32)
- ✅ All prefix lengths (/1 through /32)
- ✅ Child subnet splitting
- ✅ Real-world scenarios

**Total Tests**: 60+ test cases

## Manual Testing Checklist

### Basic Functionality

| Test Case | CIDR Input | Expected Network | Expected Broadcast | Expected Usable |
|-----------|------------|------------------|-------------------|-----------------|
| Standard /24 | `192.168.1.0/24` | `192.168.1.0` | `192.168.1.255` | 254 |
| Standard /16 | `172.16.0.0/16` | `172.16.0.0` | `172.16.255.255` | 65534 |
| Standard /8 | `10.0.0.0/8` | `10.0.0.0` | `10.255.255.255` | 16777214 |
| Non-network IP | `192.168.1.50/24` | `192.168.1.0` | `192.168.1.255` | 254 |
| /30 subnet | `192.168.1.4/30` | `192.168.1.4` | `192.168.1.7` | 2 |
| /32 host | `8.8.8.8/32` | `8.8.8.8` | `8.8.8.8` | 0 |
| /31 point-to-point | `10.0.0.0/31` | `10.0.0.0` | `10.0.0.1` | 0 |

### Edge Cases

| Test Case | Input | Should |
|-----------|-------|--------|
| Invalid IP (too high) | `256.1.1.1/24` | Show error |
| Invalid IP (text) | `abc.def.ghi.jkl/24` | Show error |
| Missing prefix | `192.168.1.1` | Show error |
| Invalid format | `192.168.1/24` | Show error |
| Negative prefix | `192.168.1.0/-5` | Clamp to /0 |
| Too large prefix | `192.168.1.0/50` | Clamp to /32 |
| Leading zeros | `192.168.001.1/24` | Show error |

### CIDR Prefix Validation (/0 through /32)

All prefix lengths should work correctly:

```
/0  - 4,294,967,296 hosts (entire IPv4 space)
/1  - 2,147,483,648 hosts
/8  - 16,777,216 hosts (Class A default)
/16 - 65,536 hosts (Class B default)
/24 - 256 hosts (Class C default)
/25 - 128 hosts
/26 - 64 hosts
/27 - 32 hosts
/28 - 16 hosts
/29 - 8 hosts
/30 - 4 hosts (2 usable)
/31 - 2 hosts (point-to-point, 0 usable)
/32 - 1 host (single host, 0 usable)
```

### Visual Subnetter Tests

| Parent Network | New Prefix | Expected Subnets |
|----------------|------------|------------------|
| `192.168.1.0/24` | /25 | 2 subnets |
| `192.168.1.0/24` | /26 | 4 subnets |
| `192.168.1.0/24` | /27 | 8 subnets |
| `192.168.1.0/24` | /28 | 16 subnets |
| `192.168.1.0/24` | /30 | 64 subnets |
| `10.0.0.0/16` | /24 | 256 subnets |

**Expected Behavior**:
- First subnet should start at parent network address
- Last subnet should end at parent broadcast address
- No gaps between subnets
- No overlaps between subnets

### Network Classification Tests

| IP Address | Expected Class |
|------------|----------------|
| `10.0.0.0` | Class A |
| `127.0.0.1` | Class A |
| `128.0.0.0` | Class B |
| `172.16.0.0` | Class B |
| `192.168.0.0` | Class C |
| `223.255.255.255` | Class C |
| `224.0.0.0` | Class D (Multicast) |
| `240.0.0.0` | Class E (Experimental) |

### Copy Functionality

Test that all copy buttons work:
- ✅ Copy IP Address
- ✅ Copy Netmask
- ✅ Copy Wildcard
- ✅ Copy Network Address
- ✅ Copy Broadcast Address
- ✅ Copy Host Range
- ✅ Copy Child Subnet CIDR

### UI/UX Tests

- [ ] Example button populates `192.168.1.10/24`
- [ ] Input validation shows error immediately
- [ ] Visual subnetter shows/hides based on valid input
- [ ] Child prefix input is constrained to valid range
- [ ] Grid layout adapts to number of subnets
- [ ] Copy buttons provide feedback (if implemented)
- [ ] Mobile responsive layout works correctly
- [ ] All text is readable and properly formatted

## Real-World Test Scenarios

### AWS VPC Planning
```
Input: 10.0.0.0/16
Split to: /24
Expected: 256 subnets for availability zones
```

### Office Network
```
Input: 192.168.0.0/22
Split to: /24
Expected: 4 departmental subnets
```

### Data Center Point-to-Point Links
```
Input: 10.10.10.0/31
Expected: 0 usable hosts (RFC 3021 compliant)
```

### Cloud Subnet CIDR Planning
```
Input: 172.31.0.0/16
Split to: /20
Expected: 16 subnets with 4094 usable hosts each
```

## Regression Tests

After any code changes, verify:

1. **All automated tests pass**: `npm test`
2. **Basic calculations work**: Try `192.168.1.0/24`
3. **Edge cases handled**: Try `/0`, `/31`, `/32`
4. **Visual subnetter works**: Split `192.168.1.0/24` into `/26`
5. **Copy buttons work**: Click various copy buttons
6. **Invalid input handled**: Try `999.999.999.999/24`

## Performance Tests

### Large Subnet Splits

| Test | Parent | Child | Expected Subnets | Render Time |
|------|--------|-------|------------------|-------------|
| Small | /24 | /26 | 4 | <10ms |
| Medium | /24 | /30 | 64 | <50ms |
| Large | /22 | /30 | 256 | <200ms |
| Very Large | /16 | /24 | 256 | <200ms |
| Capped | /16 | /32 | 1024 (capped) | <500ms |

**Note**: Visual subnetter caps at 1024 subnets for UI performance.

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Known Limitations

1. **IPv6 not supported** - Only IPv4 calculations
2. **Subnet display limit** - Shows max 128 subnets (but calculates up to 1024)
3. **Variable-length subnet masks (VLSM)** - Doesn't optimize VLSM allocation

## Future Test Cases

When new features are added:

- [ ] IPv6 support tests
- [ ] CSV export validation
- [ ] Supernetting/route summarization
- [ ] VLSM optimizer
- [ ] Binary representation display
- [ ] Hexadecimal display
