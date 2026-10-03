import random

runs = 100000000
count = 0
run = 0
while True:
    run += 1
    sum = 0
    for _ in range(8):
        sum += random.randint(1,6)
    if sum <= 16:
        count+=1
    if run % 100000 == 0:
        print(f"{(count/run * 100):.4f}%")