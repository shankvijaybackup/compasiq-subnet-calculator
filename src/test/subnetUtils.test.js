import { describe, it, expect } from 'vitest'
import {
  isValidIPv4,
  ipToInt,
  intToIp,
  prefixToMask,
  maskToPrefix,
  maskToString,
  wildcardFromMask,
  getClassful,
  clampPrefix,
  calculate,
  listChildSubnets
} from '../utils/subnetUtils'

describe('IPv4 Validation', () => {
  it('should validate correct IPv4 addresses', () => {
    expect(isValidIPv4('192.168.1.1')).toBe(true)
    expect(isValidIPv4('10.0.0.0')).toBe(true)
    expect(isValidIPv4('255.255.255.255')).toBe(true)
    expect(isValidIPv4('0.0.0.0')).toBe(true)
    expect(isValidIPv4('172.16.254.1')).toBe(true)
  })

  it('should reject invalid IPv4 addresses', () => {
    expect(isValidIPv4('256.1.1.1')).toBe(false)
    expect(isValidIPv4('192.168.1')).toBe(false)
    expect(isValidIPv4('192.168.1.1.1')).toBe(false)
    expect(isValidIPv4('192.168.-1.1')).toBe(false)
    expect(isValidIPv4('192.168.1.a')).toBe(false)
    expect(isValidIPv4('')).toBe(false)
    expect(isValidIPv4('not an ip')).toBe(false)
  })

  it('should reject leading zeros (except single zero)', () => {
    expect(isValidIPv4('192.168.001.1')).toBe(false)
    expect(isValidIPv4('192.168.0.1')).toBe(true)
  })
})

describe('IP Conversion Functions', () => {
  it('should convert IP to integer correctly', () => {
    expect(ipToInt('0.0.0.0')).toBe(0)
    expect(ipToInt('255.255.255.255')).toBe(4294967295)
    expect(ipToInt('192.168.1.1')).toBe(3232235777)
    expect(ipToInt('10.0.0.1')).toBe(167772161)
    expect(ipToInt('172.16.0.1')).toBe(2886729729)
  })

  it('should convert integer to IP correctly', () => {
    expect(intToIp(0)).toBe('0.0.0.0')
    expect(intToIp(4294967295)).toBe('255.255.255.255')
    expect(intToIp(3232235777)).toBe('192.168.1.1')
    expect(intToIp(167772161)).toBe('10.0.0.1')
    expect(intToIp(2886729729)).toBe('172.16.0.1')
  })

  it('should be reversible (IP -> Int -> IP)', () => {
    const testIPs = ['192.168.1.1', '10.0.0.0', '172.16.254.1', '255.255.255.255', '0.0.0.0']
    testIPs.forEach(ip => {
      expect(intToIp(ipToInt(ip))).toBe(ip)
    })
  })
})

describe('Prefix and Mask Functions', () => {
  it('should convert prefix to mask correctly', () => {
    expect(prefixToMask(0)).toBe(0)
    expect(prefixToMask(8)).toBe(4278190080) // 255.0.0.0
    expect(prefixToMask(16)).toBe(4294901760) // 255.255.0.0
    expect(prefixToMask(24)).toBe(4294967040) // 255.255.255.0
    expect(prefixToMask(32)).toBe(4294967295) // 255.255.255.255
  })

  it('should convert mask to prefix correctly', () => {
    expect(maskToPrefix(0)).toBe(0)
    expect(maskToPrefix(4278190080)).toBe(8)
    expect(maskToPrefix(4294901760)).toBe(16)
    expect(maskToPrefix(4294967040)).toBe(24)
    expect(maskToPrefix(4294967295)).toBe(32)
  })

  it('should convert mask to string correctly', () => {
    expect(maskToString(prefixToMask(8))).toBe('255.0.0.0')
    expect(maskToString(prefixToMask(16))).toBe('255.255.0.0')
    expect(maskToString(prefixToMask(24))).toBe('255.255.255.0')
    expect(maskToString(prefixToMask(25))).toBe('255.255.255.128')
    expect(maskToString(prefixToMask(30))).toBe('255.255.255.252')
  })

  it('should calculate wildcard mask correctly', () => {
    const mask24 = prefixToMask(24)
    expect(maskToString(wildcardFromMask(mask24))).toBe('0.0.0.255')
    
    const mask16 = prefixToMask(16)
    expect(maskToString(wildcardFromMask(mask16))).toBe('0.0.255.255')
    
    const mask30 = prefixToMask(30)
    expect(maskToString(wildcardFromMask(mask30))).toBe('0.0.0.3')
  })

  it('should clamp prefix values correctly', () => {
    expect(clampPrefix(0)).toBe(0)
    expect(clampPrefix(24)).toBe(24)
    expect(clampPrefix(32)).toBe(32)
    expect(clampPrefix(-5)).toBe(0)
    expect(clampPrefix(50)).toBe(32)
    expect(clampPrefix(24.7)).toBe(24)
    expect(clampPrefix('invalid')).toBe(24) // default
  })
})

describe('Network Classification', () => {
  it('should identify Class A networks', () => {
    expect(getClassful(ipToInt('10.0.0.0'))).toBe('Class A')
    expect(getClassful(ipToInt('127.0.0.1'))).toBe('Class A')
    expect(getClassful(ipToInt('0.0.0.0'))).toBe('Class A')
  })

  it('should identify Class B networks', () => {
    expect(getClassful(ipToInt('172.16.0.0'))).toBe('Class B')
    expect(getClassful(ipToInt('191.255.255.255'))).toBe('Class B')
    expect(getClassful(ipToInt('128.0.0.0'))).toBe('Class B')
  })

  it('should identify Class C networks', () => {
    expect(getClassful(ipToInt('192.168.0.0'))).toBe('Class C')
    expect(getClassful(ipToInt('223.255.255.255'))).toBe('Class C')
  })

  it('should identify Class D (Multicast)', () => {
    expect(getClassful(ipToInt('224.0.0.0'))).toBe('Class D (Multicast)')
    expect(getClassful(ipToInt('239.255.255.255'))).toBe('Class D (Multicast)')
  })

  it('should identify Class E (Experimental)', () => {
    expect(getClassful(ipToInt('240.0.0.0'))).toBe('Class E (Experimental)')
    expect(getClassful(ipToInt('255.255.255.255'))).toBe('Class E (Experimental)')
  })
})

describe('Subnet Calculation - Standard Cases', () => {
  it('should calculate /24 network correctly', () => {
    const result = calculate('192.168.1.10/24')
    expect(result).not.toBeNull()
    expect(result.ok).toBe(true)
    expect(result.networkStr).toBe('192.168.1.0')
    expect(result.broadcastStr).toBe('192.168.1.255')
    expect(result.maskStr).toBe('255.255.255.0')
    expect(result.wildcardStr).toBe('0.0.0.255')
    expect(result.totalHosts).toBe(256)
    expect(result.usableHosts).toBe(254)
    expect(result.firstHostStr).toBe('192.168.1.1')
    expect(result.lastHostStr).toBe('192.168.1.254')
    expect(result.prefix).toBe(24)
  })

  it('should calculate /16 network correctly', () => {
    const result = calculate('172.16.50.100/16')
    expect(result.networkStr).toBe('172.16.0.0')
    expect(result.broadcastStr).toBe('172.16.255.255')
    expect(result.maskStr).toBe('255.255.0.0')
    expect(result.totalHosts).toBe(65536)
    expect(result.usableHosts).toBe(65534)
  })

  it('should calculate /8 network correctly', () => {
    const result = calculate('10.20.30.40/8')
    expect(result.networkStr).toBe('10.0.0.0')
    expect(result.broadcastStr).toBe('10.255.255.255')
    expect(result.maskStr).toBe('255.0.0.0')
    expect(result.totalHosts).toBe(16777216)
    expect(result.usableHosts).toBe(16777214)
  })

  it('should calculate /30 network correctly', () => {
    const result = calculate('192.168.1.5/30')
    expect(result.networkStr).toBe('192.168.1.4')
    expect(result.broadcastStr).toBe('192.168.1.7')
    expect(result.maskStr).toBe('255.255.255.252')
    expect(result.totalHosts).toBe(4)
    expect(result.usableHosts).toBe(2)
    expect(result.firstHostStr).toBe('192.168.1.5')
    expect(result.lastHostStr).toBe('192.168.1.6')
  })
})

describe('Subnet Calculation - Edge Cases', () => {
  it('should handle /32 (single host) correctly', () => {
    const result = calculate('192.168.1.1/32')
    expect(result.networkStr).toBe('192.168.1.1')
    expect(result.broadcastStr).toBe('192.168.1.1')
    expect(result.maskStr).toBe('255.255.255.255')
    expect(result.totalHosts).toBe(1)
    expect(result.usableHosts).toBe(0)
    expect(result.firstHostStr).toBeNull()
    expect(result.lastHostStr).toBeNull()
  })

  it('should handle /31 (point-to-point) correctly', () => {
    const result = calculate('10.0.0.0/31')
    expect(result.networkStr).toBe('10.0.0.0')
    expect(result.broadcastStr).toBe('10.0.0.1')
    expect(result.totalHosts).toBe(2)
    expect(result.usableHosts).toBe(0) // RFC 3021: /31 has no usable in traditional sense
    expect(result.firstHostStr).toBeNull()
    expect(result.lastHostStr).toBeNull()
  })

  it('should handle /0 (entire internet) correctly', () => {
    const result = calculate('0.0.0.0/0')
    expect(result.networkStr).toBe('0.0.0.0')
    expect(result.broadcastStr).toBe('255.255.255.255')
    expect(result.maskStr).toBe('0.0.0.0')
    expect(result.totalHosts).toBe(4294967296)
    expect(result.usableHosts).toBe(4294967294)
  })

  it('should handle /1 correctly', () => {
    const result = calculate('128.0.0.0/1')
    expect(result.networkStr).toBe('128.0.0.0')
    expect(result.broadcastStr).toBe('255.255.255.255')
    expect(result.maskStr).toBe('128.0.0.0')
  })

  it('should return null for invalid CIDR', () => {
    expect(calculate('')).toBeNull()
    expect(calculate('192.168.1.1')).toBeNull()
    expect(calculate('invalid/24')).toBeNull()
    expect(calculate('256.1.1.1/24')).toBeNull()
    expect(calculate('192.168.1.1/invalid')).not.toBeNull() // clamps to default
  })
})

describe('Subnet Calculation - Various Prefixes', () => {
  it('should calculate /25 network correctly', () => {
    const result = calculate('192.168.1.0/25')
    expect(result.networkStr).toBe('192.168.1.0')
    expect(result.broadcastStr).toBe('192.168.1.127')
    expect(result.usableHosts).toBe(126)
  })

  it('should calculate /26 network correctly', () => {
    const result = calculate('192.168.1.64/26')
    expect(result.networkStr).toBe('192.168.1.64')
    expect(result.broadcastStr).toBe('192.168.1.127')
    expect(result.usableHosts).toBe(62)
  })

  it('should calculate /27 network correctly', () => {
    const result = calculate('192.168.1.32/27')
    expect(result.networkStr).toBe('192.168.1.32')
    expect(result.broadcastStr).toBe('192.168.1.63')
    expect(result.usableHosts).toBe(30)
  })

  it('should calculate /28 network correctly', () => {
    const result = calculate('192.168.1.16/28')
    expect(result.networkStr).toBe('192.168.1.16')
    expect(result.broadcastStr).toBe('192.168.1.31')
    expect(result.usableHosts).toBe(14)
  })

  it('should calculate /29 network correctly', () => {
    const result = calculate('192.168.1.8/29')
    expect(result.networkStr).toBe('192.168.1.8')
    expect(result.broadcastStr).toBe('192.168.1.15')
    expect(result.usableHosts).toBe(6)
  })
})

describe('Child Subnet Listing', () => {
  it('should split /24 into /26 subnets correctly', () => {
    const parentNet = ipToInt('192.168.1.0')
    const subnets = listChildSubnets(parentNet, 24, 26)
    
    expect(subnets).toHaveLength(4)
    expect(subnets[0].network).toBe('192.168.1.0')
    expect(subnets[0].broadcast).toBe('192.168.1.63')
    expect(subnets[1].network).toBe('192.168.1.64')
    expect(subnets[1].broadcast).toBe('192.168.1.127')
    expect(subnets[2].network).toBe('192.168.1.128')
    expect(subnets[3].network).toBe('192.168.1.192')
  })

  it('should split /24 into /25 subnets correctly', () => {
    const parentNet = ipToInt('10.0.0.0')
    const subnets = listChildSubnets(parentNet, 24, 25)
    
    expect(subnets).toHaveLength(2)
    expect(subnets[0].network).toBe('10.0.0.0')
    expect(subnets[0].broadcast).toBe('10.0.0.127')
    expect(subnets[1].network).toBe('10.0.0.128')
    expect(subnets[1].broadcast).toBe('10.0.0.255')
  })

  it('should handle same prefix (no split)', () => {
    const parentNet = ipToInt('192.168.1.0')
    const subnets = listChildSubnets(parentNet, 24, 24)
    
    expect(subnets).toHaveLength(1)
    expect(subnets[0].network).toBe('192.168.1.0')
    expect(subnets[0].broadcast).toBe('192.168.1.255')
  })

  it('should return empty array for invalid split (child < parent)', () => {
    const parentNet = ipToInt('192.168.1.0')
    const subnets = listChildSubnets(parentNet, 24, 16)
    
    expect(subnets).toHaveLength(0)
  })

  it('should limit output to 1024 subnets', () => {
    const parentNet = ipToInt('192.168.0.0')
    const subnets = listChildSubnets(parentNet, 16, 32) // Would be 65536 subnets
    
    expect(subnets).toHaveLength(1024)
  })

  it('should calculate usable hosts correctly for child subnets', () => {
    const parentNet = ipToInt('192.168.1.0')
    const subnets = listChildSubnets(parentNet, 24, 30)
    
    expect(subnets[0].usable).toBe(2)
    expect(subnets[0].firstHost).toBe('192.168.1.1')
    expect(subnets[0].lastHost).toBe('192.168.1.2')
  })

  it('should handle /31 child subnets with no usable hosts', () => {
    const parentNet = ipToInt('192.168.1.0')
    const subnets = listChildSubnets(parentNet, 24, 31)
    
    expect(subnets[0].usable).toBe(0)
    expect(subnets[0].firstHost).toBeNull()
    expect(subnets[0].lastHost).toBeNull()
  })
})

describe('Real-World Scenarios', () => {
  it('should handle common private network 192.168.0.0/16', () => {
    const result = calculate('192.168.0.0/16')
    expect(result.networkStr).toBe('192.168.0.0')
    expect(result.broadcastStr).toBe('192.168.255.255')
    expect(result.usableHosts).toBe(65534)
  })

  it('should handle AWS VPC common CIDR 10.0.0.0/16', () => {
    const result = calculate('10.0.0.0/16')
    expect(result.networkStr).toBe('10.0.0.0')
    expect(result.broadcastStr).toBe('10.0.255.255')
  })

  it('should handle point-to-point link 192.168.1.0/31', () => {
    const result = calculate('192.168.1.0/31')
    expect(result.usableHosts).toBe(0)
    expect(result.totalHosts).toBe(2)
  })

  it('should handle IP that is not network address', () => {
    const result = calculate('192.168.1.50/24')
    expect(result.networkStr).toBe('192.168.1.0')
    expect(result.ip).toBe('192.168.1.50')
  })
})
