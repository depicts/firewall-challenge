# Firewall Reverse Engineering and Solution

Reverse engineering and solution to REDACTED BILLION DOLLAR COMPANY's new firewall. The firewall lacks a lot of security measures, which are detailed below.

## Lack of IP Validation

The firewall does not validate the IP addresses of incoming requests. This can lead to security vulnerabilities, as it allows for potential attackers to generate clearance cookies on a servers with no limitations.

## Lack of TLS Fingerprinting

> https://developers.cloudflare.com/bots/concepts/ja3-fingerprint/

TLS fingerprinting is a method of identifying clients based on their TLS handshake. The firewall does not seem to implement this, which in my opinion should have been the first thing implemented on a feature that is marketed as a ddos protection.

## Weak Obfuscation

> https://jscrambler.com/plans

The firewall's obfuscation techniques are weak and can be easily reverse engineered and allows for attackers to easily understand the firewall's inner workings.

## Pointless Proof of Work Challenge

The firewall's Proof of Work challenge is pointless, as it can be easily solved with a static fucntion. This allows for potential attackers to easily bypass the challenge.
